import os
import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Tuple, Optional

# Define the embedding model – multilingual model that handles Dutch/English well
EMB_MODEL = "BAAI/bge-m3"

# Paths for the FAISS index and metadata
RAG_STORE_DIR = "rag_store"
INDEX_PATH = os.path.join(RAG_STORE_DIR, "faiss.index")
META_PATH = os.path.join(RAG_STORE_DIR, "meta.json")

# Global variables to cache the loaded index and model
_index: Optional[faiss.Index] = None
_meta: List[Dict[str, Any]] = []
_embedder: Optional[SentenceTransformer] = None

def _ensure_model_loaded() -> SentenceTransformer:
    """Lazy load the sentence transformer model"""
    global _embedder
    if _embedder is None:
        print(f"Loading embedding model: {EMB_MODEL}")
        _embedder = SentenceTransformer(EMB_MODEL)
    return _embedder

def load_index_and_meta() -> Tuple[Optional[faiss.Index], List[Dict[str, Any]]]:
    """Load FAISS index and meta data from disk"""
    global _index, _meta
    
    if _index is not None and _meta:
        return _index, _meta
    
    if not os.path.exists(INDEX_PATH) or not os.path.exists(META_PATH):
        print(f"RAG store not found at {INDEX_PATH} or {META_PATH}")
        print("Please run the indexing script to create the content index.")
        return None, []
    
    try:
        print(f"Loading FAISS index from {INDEX_PATH}")
        _index = faiss.read_index(INDEX_PATH)
        
        print(f"Loading metadata from {META_PATH}")
        with open(META_PATH, "r", encoding="utf-8") as f:
            _meta = json.load(f)
        
        print(f"Loaded index with {_index.ntotal} vectors and {len(_meta)} metadata entries")
        return _index, _meta
        
    except Exception as e:
        print(f"Error loading RAG store: {e}")
        return None, []

def retrieve(query: str, k: int = 5) -> str:
    """
    Retrieve relevant context chunks for the given query.
    
    Args:
        query: The user's question
        k: Number of top chunks to retrieve
        
    Returns:
        Formatted context string with sources
    """
    try:
        index, meta = load_index_and_meta()
        if index is None or len(meta) == 0:
            print("No RAG index available, returning empty context")
            return ""
        
        # Load the embedding model
        model = _ensure_model_loaded()
        
        # Encode the query
        q_embedding = model.encode([query], normalize_embeddings=True)
        q_embedding = np.array(q_embedding).astype("float32")
        
        # Search for similar chunks
        distances, indices = index.search(q_embedding, k)
        
        context_chunks = []
        for i, idx in enumerate(indices[0]):
            if idx == -1 or idx >= len(meta):
                continue
                
            chunk_data = meta[idx]
            chunk_text = chunk_data.get("text", "").strip()
            source = chunk_data.get("source", "unknown source")
            
            if chunk_text:
                # Clean up source path for display
                source_display = os.path.basename(source) if source != "unknown source" else source
                context_chunks.append(f"[Source: {source_display}]\n{chunk_text}")
        
        if context_chunks:
            print(f"Retrieved {len(context_chunks)} relevant chunks for query: {query[:50]}...")
            return "\n\n".join(context_chunks)
        else:
            print("No relevant chunks found for query")
            return ""
            
    except Exception as e:
        print(f"Error in retrieval: {e}")
        return ""

def get_index_stats() -> Dict[str, Any]:
    """Get statistics about the loaded index"""
    try:
        index, meta = load_index_and_meta()
        if index is None:
            return {"status": "not_loaded", "vectors": 0, "metadata_entries": 0}
        
        return {
            "status": "loaded",
            "vectors": index.ntotal,
            "metadata_entries": len(meta),
            "embedding_model": EMB_MODEL
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}
