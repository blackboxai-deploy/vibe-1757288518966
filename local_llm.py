import os
import requests
from typing import Optional

def call_local_llm(system: str, user: str) -> str:
    """
    Calls the local LLM runtime and returns the AI generated response.
    Uses Ollama or llama.cpp via HTTP. Expects OLLAMA_URL and LLM_MODEL environment variables.
    """
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
    MODEL = os.getenv("LLM_MODEL", "llama3:8b-instruct")
    
    payload = {
        "model": MODEL,
        "prompt": f"System: {system}\n\nUser: {user}\nAssistant:",
        "stream": False,
        "options": {"temperature": 0.2}
    }
    
    try:
        print(f"Calling local LLM at {OLLAMA_URL} with model {MODEL}")
        r = requests.post(OLLAMA_URL, json=payload, timeout=120)
        r.raise_for_status()
        data = r.json()
        response = data.get("response", "").strip()
        
        if not response:
            raise ValueError("Empty response from local LLM")
            
        return response
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to local LLM server. Make sure Ollama is running.")
        raise Exception("Local LLM server is not available. Please ensure Ollama is running on the configured port.")
    except requests.exceptions.Timeout:
        print("Error: Local LLM request timed out")
        raise Exception("Local LLM request timed out. The model might be processing a complex query.")
    except requests.exceptions.HTTPError as e:
        print(f"Error: HTTP error from local LLM: {e}")
        raise Exception(f"Local LLM server returned an error: {e}")
    except Exception as e:
        print(f"Error calling local LLM: {e}")
        raise Exception(f"Failed to get response from local LLM: {str(e)}")
