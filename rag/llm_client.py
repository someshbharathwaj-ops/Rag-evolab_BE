
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

def call_llm(prompt: str) -> str:
    print("\n--- PROMPT SENT TO LLM ---\n")
    print(prompt)
    print("\n--- END PROMPT ---\n")

    return "Mock answer: RAG pipeline executed successfully."
