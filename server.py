#!/usr/bin/env python3
from __future__ import annotations

import os
from flask import send_from_directory
import requests
import server_improved as si

# Expose the Flask app for tests (server.app.test_client())
app = si.app

# Override server_improved.get_latest_videos to use real HTTP (mocked in tests)
def _yt_get_latest_videos(channel_id: str):
    api_key = os.getenv("YOUTUBE_API_KEY", "test-key")
    params = {
        "part": "snippet",
        "channelId": channel_id,
        "maxResults": 5,
        "order": "date",
        "type": "video",
        "key": api_key,
    }
    resp = requests.get(
        "https://www.googleapis.com/youtube/v3/search", params=params, timeout=10
    )
    resp.raise_for_status()
    payload = resp.json()
    videos = []
    for item in payload.get("items", []):
        vid = (item.get("id") or {}).get("videoId")
        title = (item.get("snippet") or {}).get("title")
        if vid:
            videos.append({"id": vid, "title": title})
    return {"videos": videos}

# Inject into server_improved so its /api/youtube uses the HTTP-backed implementation
si.get_latest_videos = _yt_get_latest_videos

# Serve static site files (index.html etc.) from project root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Avoid registering routes after the app has already handled a request (which can happen
# when importing this module in a test run after other tests have already used the app).
if not getattr(app, "_got_first_request", False):
    @app.route("/")
    def root():
        return send_from_directory(BASE_DIR, "index.html")

    @app.route("/<path:filename>")
    def static_files(filename: str):
        return send_from_directory(BASE_DIR, filename)

if __name__ == "__main__":
    # Initialize persistence if configured (DB_PATH) and run Flask app
    si.init_db()
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=False)
