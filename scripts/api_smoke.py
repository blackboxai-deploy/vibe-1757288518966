#!/usr/bin/env python3
"""
Lightweight API smoke test using Flask test_client (no external server needed).

Covers:
- Register (premium user)
- Authenticated add track
- List tracks
- Get current auth user
- Basic error handling assertions
"""
import json
import os
import sys
from typing import Dict, Any

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
  sys.path.insert(0, ROOT)

import server_improved as si

def main() -> int:
  app = si.app
  app.config["TESTING"] = True
  si.init_db()

  with app.test_client() as c:
    # Register user
    r = c.post("/api/register", json={"username": "user123", "password": "password123", "is_premium": True})
    assert r.status_code == 200, f"register failed: {r.status_code} {r.data!r}"
    body: Dict[str, Any] = r.get_json() or {}
    token = body.get("token")
    assert isinstance(token, str) and token, f"token missing in register response: {body}"

    # Get current auth user
    r = c.get("/api/auth/user", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200, f"auth user failed: {r.status_code} {r.data!r}"
    info = r.get_json() or {}
    assert info.get("username") == "user123", f"username mismatch: {info}"
    assert info.get("is_premium") is True, f"is_premium mismatch: {info}"

    # Add a track
    r = c.post(
      "/api/tracks",
      headers={"Authorization": f"Bearer {token}"},
      json={"title": "Test Track", "url": "https://example.com/track"},
    )
    assert r.status_code == 201, f"add track failed: {r.status_code} {r.data!r}"
    track = r.get_json() or {}
    assert track.get("title") == "Test Track", f"track title mismatch: {track}"
    assert track.get("url") == "https://example.com/track", f"track url mismatch: {track}"

    # List tracks
    r = c.get("/api/tracks")
    assert r.status_code == 200, f"list tracks failed: {r.status_code} {r.data!r}"
    listing = r.get_json() or {}
    tracks = listing.get("tracks") or []
    assert any(t.get("title") == "Test Track" for t in tracks), f"added track not found: {tracks}"

  print("API smoke test passed: register, auth user, add/list tracks OK")
  return 0

if __name__ == "__main__":
  try:
    sys.exit(main())
  except AssertionError as e:
    print(f"ASSERTION FAILED: {e}", file=sys.stderr)
    sys.exit(2)
  except Exception as e:
    print(f"UNEXPECTED ERROR: {e}", file=sys.stderr)
    sys.exit(3)
