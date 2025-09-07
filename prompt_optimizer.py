from __future__ import annotations

from typing import Dict, Optional


def _normalize_text(text: str) -> str:
    """
    Normalize whitespace and trim.
    Ensures a single space between tokens and strips leading/trailing whitespace.
    """
    if not isinstance(text, str):
        text = str(text)
    # Collapse all whitespace (including newlines/tabs) to single spaces
    normalized = " ".join(text.split())
    return normalized.strip()


def _detect_intent_style(q: str) -> str:
    """
    Extremely lightweight intent heuristic to recommend response style.
    Returns one of: "bullets" | "brief"
    """
    lq = q.lower()
    bullet_keywords = [
        "list", "compare", "vs", "versus", "pros and cons", "advantages",
        "disadvantages", "steps", "how do i", "how to", "tutorial", "checklist",
        "recommendations", "suggest", "top", "best", "options",
    ]
    if any(k in lq for k in bullet_keywords):
        return "bullets"

    interrogatives = ("who", "what", "when", "where", "why", "how", "which")
    if lq.startswith(interrogatives):
        return "brief"

    return "brief"


def optimize(question: str, backend: Optional[str] = None, max_len: int = 1000) -> Dict[str, object]:
    """
    Produce a minimally opinionated, safe, and concise optimization of a user prompt.
    - Normalizes whitespace
    - Adds a short instruction for concise, domain-focused responses
    - Hints style (bullets vs. brief) based on naive intent detection
    - Enforces a safe max length constraint

    Returns:
        {
          "prompt": str,         # optimized prompt to send to backends
          "original": str,       # original question
          "meta": {
            "normalized": bool,
            "truncated": bool,
            "strategy": str,
            "backend": Optional[str]
          }
        }
    """
    original = question if isinstance(question, str) else str(question)
    normalized = _normalize_text(original)
    style = _detect_intent_style(normalized)

    # Compose a small, prepend-only instruction that doesn't conflict with backend system prompts.
    # Keep it short to avoid inflating tokens and to respect max_len.
    if style == "bullets":
        prefix = (
            "Answer concisely and focus on music, events, mixes, and DJ topics. "
            "Use short bullet points."
        )
    else:
        prefix = (
            "Answer concisely and focus on music, events, mixes, and DJ topics. "
            "Use 1-2 sentences."
        )

    # Candidate optimized prompt with prefix + user content
    sep = "\n\n"
    candidate = f"{prefix}{sep}{normalized}" if normalized else prefix

    truncated = False
    if len(candidate) > max_len:
        # Prefer preserving as much of the user's normalized content as possible.
        # If prefix makes the prompt exceed max_len, drop or shorten it.
        # Try keeping prefix but clipping the normalized part.
        available_for_question = max_len - len(prefix) - len(sep)
        if available_for_question > 40:
            candidate = f"{prefix}{sep}{normalized[:available_for_question]}"
            truncated = True
        else:
            # If there's not enough room for both, just return the clipped normalized question.
            candidate = normalized[:max_len]
            truncated = True

    return {
        "prompt": candidate,
        "original": original,
        "meta": {
            "normalized": normalized != original,
            "truncated": truncated,
            "strategy": f"concise+domain-hint:{style}",
            "backend": backend,
        },
    }
