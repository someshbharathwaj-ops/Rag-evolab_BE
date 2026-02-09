from rag.rag_pipeline import run_rag

query = "What is the main contribution of the paper?"

answer = run_rag(query)
print(answer)
