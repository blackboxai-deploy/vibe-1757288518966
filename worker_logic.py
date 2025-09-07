import os
import requests
from typing import Optional, Dict, Any

SYSTEM_PROMPT = (
    "You are BaddBeatz' assistant. Answer briefly and helpfully about music, "
    "events, mixes, and general DJ-related questions."
)


def _resolve_api_key(explicit_api_key: Optional[str], env_var: str) -> str:
    key = explicit_api_key or os.getenv(env_var, "")
    if not key:
        raise RuntimeError(f"Missing API key. Set {env_var}.")
    return key


def ask(question: str, api_key: Optional[str] = None, timeout: float = 10.0) -> Dict[str, Any]:
    """
    Calls OpenAI Chat Completions API with a simple payload.
    Tests use requests-mock to intercept this call, so no real network is expected.
    Returns the raw JSON from the API (tests assert on id and headers).
    """
    key = _resolve_api_key(api_key, "OPENAI_API_KEY")
    url = "https://api.openai.com/v1/chat/completions"

    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question},
        ],
    }

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=timeout)
    resp.raise_for_status()
    return resp.json()
