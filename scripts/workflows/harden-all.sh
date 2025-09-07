#!/usr/bin/env bash
set -euo pipefail

# Vereist: yq (Mike Farah) v4+. Check:
if ! yq --version >/dev/null 2>&1; then
  echo "yq is required. Install via: brew install yq  |  choco install yq  |  sudo snap install yq"
  exit 1
fi

shopt -s nullglob
WF_DIR=".github/workflows"
FILES=("$WF_DIR"/*.yml "$WF_DIR"/*.yaml)

if [ ${#FILES[@]} -eq 0 ]; then
  echo "No workflow files found in $WF_DIR"
  exit 0
fi

for f in "${FILES[@]}"; do
  echo "🔧 Hardening: $f"

  # 1) Zet/normalizeer concurrency (top-level)
  yq -i '
    .concurrency //= {"group": "wf-${{ github.workflow }}-${{ github.ref }}", "cancel-in-progress": true}
    | .concurrency.group = (.concurrency.group // "wf-${{ github.workflow }}-${{ github.ref }}")
    | .concurrency."cancel-in-progress" = true
  ' "$f"

  # 2) Minimale workflow-permissions; start met contents: read
  #    We overschrijven top-level permissions naar veilig minimum,
  #    en escaleren conditioneel op patterns (Pages deploy, PR comments, create-pull-request, git push).
  yq -i '.permissions = {"contents":"read"}' "$f"

  FILE_TXT="$(tr -d '\r' < "$f")"

  # Pages deploy → pages: write + id-token: write
  if grep -Eq 'actions/(deploy-pages|configure-pages|upload-pages-artifact)@' <<< "$FILE_TXT"; then
    yq -i '.permissions.pages = "write" | .permissions."id-token" = "write"' "$f"
  fi

  # PR comment via github-script → pull-requests: write
  if grep -Eq 'actions/github-script@' <<< "$FILE_TXT" && grep -Eq 'createComment\(' <<< "$FILE_TXT"; then
    yq -i '.permissions."pull-requests" = "write"' "$f"
  fi

  # create-pull-request action → contents/pull-requests write
  if grep -Eq 'peter-evans/create-pull-request@' <<< "$FILE_TXT"; then
    yq -i '.permissions.contents = "write" | .permissions."pull-requests" = "write"' "$f"
  fi

  # Git push met GITHUB_TOKEN → contents: write
  if grep -Eq 'git (push|commit|tag).*GITHUB_TOKEN' <<< "$FILE_TXT"; then
    yq -i '.permissions.contents = "write"' "$f"
  fi

  # 3) Node versie normaliseren naar 20 indien setup-node gebruikt
  if grep -Eq 'actions/setup-node@' <<< "$FILE_TXT"; then
    yq -i '
      (.env //= {}) as $e
      | .env.NODE_VERSION = "20"
    ' "$f"
    # update elke setup-node stap naar env var
    yq -i '
      (.jobs // {}) |= with_entries(
        .value.steps |= (map(
          if has("uses") and (.uses | test("actions/setup-node@")) then
            .with = ((.with // {}) * {"node-version": "${{ env.NODE_VERSION }}","cache":"npm"})
          else . end
        ))
      )
    ' "$f"
  fi

  # 4) Cancel redundant permissions op job-niveau (verwijder als exact gelijk aan workflow)
  #    (We laten bestaande job-permissions met extra scopes ongemoeid.)
  yq -i '
    (.jobs // {}) |= with_entries(
      if (.value.permissions // {} ) == {"contents":"read"} then
        del(.value.permissions)
      else . end
    )
  ' "$f"

  # 5) Verwijder obvious stray lijnen (b.v. losse branch-strings)
  #    — alleen veilige no-op garbage: naakte tokens zonder key: value of '-' prefix.
  #    We doen dit voorzichtig: detecteer lijnen die alleen letters, /, -, _ bevatten.
  tmp="$(mktemp)"
  awk '!/^[[:space:]]*[A-Za-z0-9._/-]+[[:space:]]*$|^$/ {print; next} !/^[[:space:]]*[A-Za-z0-9._/-]+[[:space:]]*$/ {print}' "$f" > "$tmp" || true
  # Alleen overschrijven als yaml nog valide
  if yq e '.' "$tmp" >/dev/null 2>&1; then
    mv "$tmp" "$f"
  else
    rm -f "$tmp"
  fi

  # 6) Format netjes
  yq -i '... style="flow"' "$f" >/dev/null 2>&1 || true
done

echo "✅ Hardening completed."
