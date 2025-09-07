import os
from typing import Any, Callable, Dict, List, Optional

# Expose a `pipeline` symbol that tests can monkeypatch.
try:
    from transformers import pipeline  # type: ignore
except Exception:  # pragma: no cover - tests patch huggingface_logic.pipeline
    def pipeline(task: str, model: Optional[str] = None) -> Callable[[str], List[Dict[str, Any]]]:  # type: ignore
        def _run(prompt: str, **_: Any) -> List[Dict[str, Any]]:
            # Minimal fallback shape; tests replace this with a fake pipeline.
            return [{"generated_text": "fallback"}]
        return _run


def ask(question: str, model: Optional[str] = None) -> Dict[str, Any]:
    """
    Simple HuggingFace text-generation wrapper.

    Tests patch `huggingface_logic.pipeline` to a fake that:
      - captures the model argument
      - returns a callable producing a list of dicts with `generated_text`
    This function should:
      - choose model from argument or HF_MODEL env var (if provided)
      - call pipeline("text-generation", model=selected)
      - invoke the returned callable with the question
      - return {'text': <generated_text>} from the first item
    """
    selected_model = model or os.getenv("HF_MODEL")
    run = pipeline("text-generation", model=selected_model)

    out = run(question)
    text = ""
    if isinstance(out, list) and out:
        first = out[0]
        if isinstance(first, dict):
            text = str(first.get("generated_text", "")) or str(first.get("text", ""))
        else:
            text = str(first)
    elif isinstance(out, dict):
        text = str(out.get("generated_text", "")) or str(out.get("text", ""))  # type: ignore[assignment]
    else:
        text = str(out)

    return {"text": text}
