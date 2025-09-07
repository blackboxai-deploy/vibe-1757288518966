import sys
import os
import re

# Ensure project root is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import prompt_optimizer as po  # noqa: E402


def test_normalization_and_prefix():
    res = po.optimize("  Hello \n world\t ")
    assert isinstance(res, dict)
    prompt = res.get("prompt", "")
    meta = res.get("meta", {})
    # Normalized content should appear
    assert "Hello world" in prompt
    # Meta should reflect normalization
    assert isinstance(meta, dict)
    assert meta.get("normalized") is True
    # Prefix must ask for concise and domain focus
    assert "Answer concisely" in prompt
    assert any(k in prompt for k in ["music", "events", "mixes", "DJ"])


def test_style_bullets_detected():
    res = po.optimize("List top techno tracks for a warehouse set")
    strategy = res["meta"]["strategy"]
    assert strategy.endswith(":bullets")
    # Prompt should hint bullets
    assert "bullet points" in res["prompt"].lower()


def test_style_brief_detected():
    res = po.optimize("What is techno?")
    strategy = res["meta"]["strategy"]
    assert strategy.endswith(":brief")
    assert "1-2 sentences" in res["prompt"]


def test_truncation_enforced():
    long_q = "track " * 1000  # very long question
    max_len = 120
    res = po.optimize(long_q, max_len=max_len)
    assert len(res["prompt"]) <= max_len
    assert res["meta"]["truncated"] is True


def test_backend_meta_passthrough():
    res = po.optimize("hi there", backend="openai")
    assert res["meta"]["backend"] == "openai"


def test_empty_input_yields_prefix_only_or_nonempty_prompt():
    res = po.optimize("")
    prompt = res["prompt"]
    # Should still be non-empty and include the guidance prefix
    assert isinstance(prompt, str) and len(prompt) > 0
    assert "Answer concisely" in prompt
