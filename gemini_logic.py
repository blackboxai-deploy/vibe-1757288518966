import os
from typing import Optional, Dict, Any

# Provide a module-level 'genai' attribute so tests can patch it even if the real
# google.generativeai package is not installed in the environment.
try:
    import google.generativeai as genai  # type: ignore
except Exception:  # pragma: no cover - tests patch gemini_logic.genai directly
    class _GenAIDummy:
        def configure(self, **_: Any) -> None:  # placeholder
            pass

        class GenerativeModel:  # placeholder shape; tests patch the whole module
            def __init__(self, *_: Any, **__: Any) -> None:
                pass

            def generate_content(self, *_: Any, **__: Any):
                class _Resp:
                    text = "fallback"
                return _Resp()

    genai = _GenAIDummy()  # type: ignore


SYSTEM_PROMPT = (
    "You are BaddBeatz' Gemini assistant. Answer concisely about music, "
    "events, mixes, and DJ-related topics."
)


def _resolve_api_key(explicit: Optional[str], env_var: str) -> str:
    key = explicit or os.getenv(env_var, "")
    if not key:
        raise RuntimeError(f"Missing API key. Set {env_var}.")
    return key


def ask(question: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a Gemini model call. Tests patch gemini_logic.genai to assert:
      - genai.configure(api_key=...)
      - genai.GenerativeModel('gemini-pro', system_instruction=SYSTEM_PROMPT)
      - model.generate_content(question)
    Returns a dict with {'text': ...} based on the model response.
    """
    key = _resolve_api_key(api_key, "GEMINI_API_KEY")
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-pro", system_instruction=SYSTEM_PROMPT)
    resp = model.generate_content(question)
    # Tests expect a .text attribute on the response object
    text = getattr(resp, "text", "")
    return {"text": text}
