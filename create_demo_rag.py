#!/usr/bin/env python3
"""
Create a demo RAG store for BaddBeatz DJ website
This creates sample content for testing the self-hosted chat system
"""

import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

# Sample content about BaddBeatz DJ
SAMPLE_CONTENT = [
    {
        "text": "TheBadGuyHimself is a professional DJ specializing in underground techno, hardstyle, and electronic music across Europe. With over 4 years of experience, he creates high-energy sets that keep crowds locked in the groove.",
        "source": "about.html"
    },
    {
        "text": "BaddBeatz offers DJ services for various events including club nights, festivals, private parties, and corporate events. Booking rates vary by event type and duration. Contact for custom quotes.",
        "source": "bookings.html"
    },
    {
        "text": "The DJ's music style includes explosive techno, rawstyle bangers, hardstyle, house music, and seamless transitions. He blends different electronic genres to create unique experiences.",
        "source": "music.html"
    },
    {
        "text": "Equipment setup includes professional DJ controllers, high-quality speakers, lighting systems, and mixing software. Technical requirements can be customized based on venue needs.",
        "source": "technical_info.txt"
    },
    {
        "text": "Available for bookings across Europe with flexible travel arrangements. Popular venues include clubs in Amsterdam, Berlin, London, and other major European cities.",
        "source": "locations.txt"
    },
    {
        "text": "Latest mixes and tracks are available on SoundCloud and YouTube. Regular uploads include house mixes, techno sets, and hardstyle compilations from 2024.",
        "source": "social_media.txt"
    },
    {
        "text": "Event pricing: Club nights €500-800, Private parties €300-600, Festivals €800-1500, Corporate events €400-900. Prices include basic equipment and 4-hour sets.",
        "source": "pricing.txt"
    },
    {
        "text": "Contact information: Available through the website contact form, social media channels, or direct booking inquiries. Response time typically within 24 hours.",
        "source": "contact.html"
    },
    {
        "text": "Gallery features photos from recent performances, behind-the-scenes content, and event highlights. Updated regularly with new content from shows and festivals.",
        "source": "gallery.html"
    },
    {
        "text": "TheBadGuyHimself can answer questions in both English and Dutch. Bilingual support for international bookings and local Dutch events.",
        "source": "language_support.txt"
    }
]

def create_demo_rag_store():
    """Create a demo FAISS index with sample content"""
    print("Creating demo RAG store for BaddBeatz...")
    
    # Create output directory
    os.makedirs("rag_store", exist_ok=True)
    
    # Load embedding model
    print("Loading embedding model...")
    model = SentenceTransformer("BAAI/bge-m3")
    
    # Extract texts
    texts = [item["text"] for item in SAMPLE_CONTENT]
    
    # Generate embeddings
    print("Generating embeddings...")
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=True)
    
    # Create FAISS index
    print("Creating FAISS index...")
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)  # Inner product for normalized embeddings
    index.add(embeddings.astype('float32'))
    
    # Save index
    index_path = os.path.join("rag_store", "faiss.index")
    print(f"Saving FAISS index to {index_path}")
    faiss.write_index(index, index_path)
    
    # Save metadata
    meta_path = os.path.join("rag_store", "meta.json")
    print(f"Saving metadata to {meta_path}")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(SAMPLE_CONTENT, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Demo RAG store created successfully!")
    print(f"   - Indexed {len(SAMPLE_CONTENT)} text chunks")
    print(f"   - Embedding dimension: {dim}")
    print(f"   - Index file: {index_path}")
    print(f"   - Metadata file: {meta_path}")
    
    # Test retrieval
    print("\n🧪 Testing retrieval...")
    test_query = "How much does it cost to book the DJ?"
    query_embedding = model.encode([test_query], normalize_embeddings=True)
    distances, indices = index.search(query_embedding.astype('float32'), 3)
    
    print(f"Query: {test_query}")
    print("Top results:")
    for i, idx in enumerate(indices[0]):
        if idx != -1:
            print(f"  {i+1}. [{SAMPLE_CONTENT[idx]['source']}] {SAMPLE_CONTENT[idx]['text'][:100]}...")

if __name__ == "__main__":
    create_demo_rag_store()
