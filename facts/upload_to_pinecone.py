import os
import json
import boto3
from pathlib import Path
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv(Path(__file__).parent / ".env")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

EMBEDDING_MODEL_ID = "cohere.embed-english-v3"
MAX_CHUNK_LENGTH = 2048
CHUNK_OVERLAP = int(MAX_CHUNK_LENGTH * 0.2)  # 20% overlap = 409 chars
FACTS_DIR = Path(__file__).parent


def chunk_text(text: str) -> list[str]:
    """Split text into chunks of MAX_CHUNK_LENGTH with 20% overlap."""
    if len(text) <= MAX_CHUNK_LENGTH:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = start + MAX_CHUNK_LENGTH
        chunks.append(text[start:end])
        if end >= len(text):
            break
        start += MAX_CHUNK_LENGTH - CHUNK_OVERLAP
    return chunks


def get_bedrock_client():
    return boto3.client(
        "bedrock-runtime",
        region_name=AWS_REGION
    )


def embed_text(bedrock_client, text: str) -> list[float]:
    body = json.dumps({
                "texts": [text],
                "input_type": "search_document",
                "embedding_types": ["float"]
            })
    response = bedrock_client.invoke_model(
        modelId=EMBEDDING_MODEL_ID,
        body=body,
        contentType="application/json",
        accept="application/json",
    )
    result = json.loads(response["body"].read())
    return result.get('embeddings', {}).get('float', [])[0]


def load_facts() -> list[dict]:
    docs = []
    for md_file in sorted(FACTS_DIR.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        docs.append({"file_name": md_file.name, "content": content})
    return docs


def upload(docs: list[dict], bedrock_client, index):
    vectors = []
    for doc in docs:
        chunks = chunk_text(doc["content"])
        print(f"  Embedding {doc['file_name']} ({len(chunks)} chunk(s))...")
        base_id = doc["file_name"].replace(".md", "")
        for chunk_idx, chunk in enumerate(chunks):
            embedding = embed_text(bedrock_client, chunk)
            vec_id = base_id if len(chunks) == 1 else f"{base_id}_chunk{chunk_idx}"
            vectors.append({
                "id": vec_id,
                "values": embedding,
                "metadata": {
                    "doc_name": doc["file_name"],
                    "priority": "high",
                    "chunk_idx": chunk_idx,
                    "total_chunks": len(chunks),
                    "text": chunk,
                },
            })

    print(f"\nUploading {len(vectors)} vectors to Pinecone index '{PINECONE_INDEX_NAME}'...")
    index.upsert(vectors=vectors)
    print("Done.")


def main():
    print("Loading facts...")
    docs = load_facts()
    print(f"Found {len(docs)} files.\n")

    print("Initializing Bedrock client...")
    bedrock_client = get_bedrock_client()

    print("Connecting to Pinecone...")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX_NAME)

    upload(docs, bedrock_client, index)


if __name__ == "__main__":
    main()
