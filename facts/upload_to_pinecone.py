import os
import re
import sys
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

UPSERT_BATCH = 100
DELETE_BATCH = 1000
CHUNK_ID_RE = re.compile(r"_chunk\d+$")


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


def plan_vectors(docs: list[dict]) -> tuple[list[dict], set[str], set[str]]:
    """Build the per-chunk plan (id, metadata, text) WITHOUT embedding yet.

    Returns (plan, new_ids, base_ids). Keeping the id/metadata scheme identical
    to the retrieval side is intentional -- do not change it here.
    """
    plan = []
    base_ids = set()
    for doc in docs:
        chunks = chunk_text(doc["content"])
        base_id = doc["file_name"].replace(".md", "")
        base_ids.add(base_id)
        for chunk_idx, chunk in enumerate(chunks):
            vec_id = base_id if len(chunks) == 1 else f"{base_id}_chunk{chunk_idx}"
            plan.append({
                "id": vec_id,
                "text": chunk,
                "metadata": {
                    "doc_name": doc["file_name"],
                    "priority": "high",
                    "chunk_idx": chunk_idx,
                    "total_chunks": len(chunks),
                    "text": chunk,
                },
            })
    new_ids = {p["id"] for p in plan}
    return plan, new_ids, base_ids


def _extract_id(item) -> str | None:
    if isinstance(item, str):
        return item
    return getattr(item, "id", None)


def existing_facts_ids(index, base_ids: set[str]) -> set[str]:
    """All vector IDs already in the index that belong to THESE facts docs.

    Scoped strictly by the facts docs' own id-prefixes and then re-validated so
    that the separate `doc_*` RAG vectors can never be matched or deleted.
    """
    found = set()
    for base in base_ids:
        for page in index.list(prefix=base):
            for item in page:
                vid = _extract_id(item)
                if vid and CHUNK_ID_RE.sub("", vid) in base_ids:
                    found.add(vid)
    return found


def upsert_batches(index, vectors: list[dict]):
    for i in range(0, len(vectors), UPSERT_BATCH):
        batch = vectors[i:i + UPSERT_BATCH]
        index.upsert(vectors=batch)
        print(f"  upserted {i + len(batch)}/{len(vectors)}")


def delete_batches(index, ids: list[str]):
    for i in range(0, len(ids), DELETE_BATCH):
        index.delete(ids=ids[i:i + DELETE_BATCH])


def upload(docs: list[dict], bedrock_client, index, dry_run: bool = False):
    plan, new_ids, base_ids = plan_vectors(docs)

    # Figure out what already exists for these facts docs, and what is stale.
    # Stale = existing facts chunks whose id is no longer produced (only happens
    # when a doc's chunk COUNT shrinks). Unchanged ids are refreshed in place by
    # upsert; grown docs get their new chunk ids added by upsert.
    existing = existing_facts_ids(index, base_ids)
    stale = sorted(existing - new_ids)

    print(f"\nPlan for index '{PINECONE_INDEX_NAME}' (facts family only):")
    print(f"  facts vectors to upsert : {len(new_ids)}")
    print(f"  facts vectors already in: {len(existing)}")
    print(f"  stale to delete         : {len(stale)}")
    for s in stale:
        print(f"      - {s}")
    guard = [s for s in stale if s.startswith("doc_")]
    if guard:
        raise SystemExit(f"ABORT: refusing to delete non-facts ids: {guard}")

    if dry_run:
        print("\n[dry-run] no embeddings, no writes, no deletes. Exiting.")
        return

    # Embed now (Bedrock), then upsert fresh, then remove stale.
    vectors = []
    for p in plan:
        vectors.append({
            "id": p["id"],
            "values": embed_text(bedrock_client, p["text"]),
            "metadata": p["metadata"],
        })

    print(f"\nUpserting {len(vectors)} vectors...")
    upsert_batches(index, vectors)

    if stale:
        print(f"Deleting {len(stale)} stale facts vector(s)...")
        delete_batches(index, stale)

    print("Done.")
    verify(index, base_ids)


def verify(index, base_ids: set[str]):
    """Sanity check: report facts vs doc_* counts so the separate RAG is provably intact."""
    facts = docs = other = 0
    for page in index.list():
        for item in page:
            vid = _extract_id(item)
            if not vid:
                continue
            if CHUNK_ID_RE.sub("", vid) in base_ids or re.match(r"^\d{2}-", vid):
                facts += 1
            elif vid.startswith("doc_"):
                docs += 1
            else:
                other += 1
    print(f"\nPost-upload index state: facts={facts}  doc_*(separate RAG)={docs}  other={other}")


def main():
    dry_run = "--dry-run" in sys.argv

    print("Loading facts...")
    docs = load_facts()
    print(f"Found {len(docs)} files.\n")

    if not dry_run:
        print("Initializing Bedrock client...")
        bedrock_client = get_bedrock_client()
    else:
        bedrock_client = None

    print("Connecting to Pinecone...")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX_NAME)

    upload(docs, bedrock_client, index, dry_run=dry_run)


if __name__ == "__main__":
    main()
