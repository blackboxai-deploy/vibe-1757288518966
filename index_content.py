#!/usr/bin/env python3
"""
Content Indexer for BaddBeatz DJ Website
Crawls website content and indexes Drive + site content into FAISS for RAG retrieval
"""

import os
import glob
import faiss
import json
import time
from sentence_transformers import SentenceTransformer
from langdetect import detect
from typing import List, Dict, Any
import requests
import trafilatura
from pypdf import PdfReader

# Configuration
EMB_MODEL = "BAAI/bge-m3"  # multilingual, good for Dutch/English
DATA_DIRS = ["/data/drive-mirror", "/data/site-crawl"]  # Adjust paths as needed
OUT_DIR = "./rag_store"
WEBSITE_URL = "https://baddbeatz.com"  # Your website URL

# Create output directory
os.makedirs(OUT_DIR, exist_ok=True)

def read_pdf(path: str) -> str:
    """Extract text from PDF file"""
    try:
        reader = PdfReader(path)
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        return "\n".join(text_parts)
    except Exception as e:
        print(f"Error reading PDF {path}: {e}")
        return ""

def read_txt(path: str) -> str:
    """Read text from file"""
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception as e:
        print(f"Error reading text file {path}: {e}")
        return ""

def crawl_site(start_url: str, out_dir: str) -> str:
    """Crawl website and extract text content"""
    try:
        print(f"Crawling website: {start_url}")
        html = trafilatura.fetch_url(start_url)
        if not html:
            print(f"Failed to fetch {start_url}")
            return ""
        
        text = trafilatura.extract(html) or ""
        if text:
            os.makedirs(out_dir, exist_ok=True)
            fp = os.path.join(out_dir, "site_home.txt")
            with open(fp, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Saved website content to {fp}")
            return fp
        return ""
    except Exception as e:
        print(f"Error crawling site {start_url}: {e}")
        return ""

def crawl_local_html_files() -> List[str]:
    """Crawl local HTML files from the website"""
    html_files = []
    html_patterns = ["*.html", "**/*.html"]
    
    for pattern in html_patterns:
        for html_file in glob.glob(pattern, recursive=True):
            # Skip certain files
            if any(skip in html_file for skip in ['node_modules', 'dist', 'docs', '.git']):
                continue
                
            try:
                content = read_txt(html_file)
                if content:
                    # Extract text content from HTML using trafilatura
                    text = trafilatura.extract(content) or ""
                    if text and len(text.strip()) > 50:  # Only include substantial content
                        # Save extracted text
                        text_file = os.path.join(OUT_DIR, f"site_{os.path.basename(html_file)}.txt")
                        with open(text_file, "w", encoding="utf-8") as f:
                            f.write(text)
                        html_files.append(text_file)
                        print(f"Extracted content from {html_file} -> {text_file}")
            except Exception as e:
                print(f"Error processing {html_file}: {e}")
    
    return html_files

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 150) -> List[str]:
    """Split text into overlapping chunks"""
    if not text or len(text.strip()) < 50:
        return []
    
    words = text.split()
    chunks = []
    i = 0
    
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunk = " ".join(chunk_words)
        
        if chunk.strip():
            chunks.append(chunk.strip())
        
        i += chunk_size - overlap
        
        # Avoid infinite loop
        if i <= len(words) - chunk_size + overlap:
            continue
        else:
            break
    
    return chunks

def load_documents() -> List[Dict[str, str]]:
    """Load and process all documents"""
    docs = []
    
    # Process Drive files (if directory exists)
    drive_dir = "/data/drive-mirror"
    if os.path.exists(drive_dir):
        print(f"Processing Drive files from {drive_dir}")
        for root, dirs, files in os.walk(drive_dir):
            for file in files:
                path = os.path.join(root, file)
                lower_path = path.lower()
                
                text = ""
                if lower_path.endswith(".pdf"):
                    text = read_pdf(path)
                elif lower_path.endswith((".txt", ".md")):
                    text = read_txt(path)
                
                if text and len(text.strip()) > 50:
                    chunks = chunk_text(text)
                    for chunk in chunks:
                        docs.append({"text": chunk, "source": path})
                    print(f"Added {len(chunks)} chunks from {path}")
    else:
        print(f"Drive directory {drive_dir} not found, skipping")
    
    # Process local website files
    print("Processing local HTML files")
    site_files = crawl_local_html_files()
    for site_file in site_files:
        text = read_txt(site_file)
        if text:
            chunks = chunk_text(text)
            for chunk in chunks:
                docs.append({"text": chunk, "source": site_file})
            print(f"Added {len(chunks)} chunks from {site_file}")
    
    # Also try to crawl the live website if accessible
    site_crawl_dir = os.path.join(OUT_DIR, "site_crawl")
    os.makedirs(site_crawl_dir, exist_ok=True)
    crawled_file = crawl_site(WEBSITE_URL, site_crawl_dir)
    if crawled_file:
        text = read_txt(crawled_file)
        if text:
            chunks = chunk_text(text)
            for chunk in chunks:
                docs.append({"text": chunk, "source": crawled_file})
            print(f"Added {len(chunks)} chunks from live website")
    
    return docs

def main():
    """Main indexing function"""
    print("Starting content indexing for BaddBeatz DJ website...")
    print(f"Output directory: {OUT_DIR}")
    print(f"Embedding model: {EMB_MODEL}")
    
    # Load documents
    docs = load_documents()
    if not docs:
        print("No documents found to index!")
        return
    
    print(f"Total documents loaded: {len(docs)}")
    
    # Filter to Dutch/English chunks to keep index focused
    filtered_docs = []
    for doc in docs:
        try:
            # Check language of first 1000 characters
            sample_text = doc["text"][:1000]
            lang = detect(sample_text)
            if lang in ("nl", "en"):  # Dutch or English
                filtered_docs.append(doc)
            else:
                print(f"Skipping non-Dutch/English content (detected: {lang})")
        except Exception:
            # If language detection fails, include the document anyway
            filtered_docs.append(doc)
    
    print(f"Documents after language filtering: {len(filtered_docs)}")
    
    if not filtered_docs:
        print("No documents remaining after filtering!")
        return
    
    # Load embedding model
    print(f"Loading embedding model: {EMB_MODEL}")
    model = SentenceTransformer(EMB_MODEL)
    
    # Generate embeddings
    print("Generating embeddings...")
    texts = [doc["text"] for doc in filtered_docs]
    embeddings = model.encode(
        texts, 
        batch_size=32, 
        show_progress_bar=True, 
        normalize_embeddings=True
    )
    
    # Create FAISS index
    print("Creating FAISS index...")
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)  # Inner product for normalized embeddings
    index.add(embeddings.astype('float32'))
    
    # Save index and metadata
    index_path = os.path.join(OUT_DIR, "faiss.index")
    meta_path = os.path.join(OUT_DIR, "meta.json")
    
    print(f"Saving FAISS index to {index_path}")
    faiss.write_index(index, index_path)
    
    print(f"Saving metadata to {meta_path}")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(filtered_docs, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Indexing complete!")
    print(f"   - Indexed {len(filtered_docs)} text chunks")
    print(f"   - Embedding dimension: {dim}")
    print(f"   - Index file: {index_path}")
    print(f"   - Metadata file: {meta_path}")
    print(f"   - Completed at: {time.ctime()}")

if __name__ == "__main__":
    main()
