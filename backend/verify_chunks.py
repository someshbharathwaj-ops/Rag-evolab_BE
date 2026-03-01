import json

# Load the chunks file
with open('data/data/chunks/chunks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total chunks processed: {len(data)}")
print("\nSample chunk structure:")
if data:
    chunk = data[0]
    print(f"Keys: {list(chunk.keys())}")
    print(f"Text preview: {chunk['text'][:200]}...")
    print(f"Metadata: {chunk['metadata']}")