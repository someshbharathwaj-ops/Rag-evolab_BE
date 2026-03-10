import os
from ollama import chat
from ollama import ResponseError
from ollama import Client
import requests

# Configuration
MODEL_NAME = os.getenv('MODEL_NAME', 'google/flan-t5-base')
MAX_TOKENS = 300
TEMPERATURE = 0.1
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
HUGGING_FACE_TOKEN = os.getenv('HUGGING_FACE_TOKEN')

def call_llm(prompt: str) -> str:
    """
    Calls LLM using multiple backends (priority order):
    1. Hugging Face Inference API (FREE) - if token exists
    2. OpenRouter API - if API key exists
    3. Ollama (local or remote) - fallback
    Always returns a string.
    """
    
    # Use Hugging Face if token is provided (FREE)
    if HUGGING_FACE_TOKEN:
        return _call_huggingface(prompt)
    # Use OpenRouter if API key is provided
    elif OPENROUTER_API_KEY:
        return _call_openrouter(prompt)
    else:
        # Use local/remote Ollama instance
        return _call_ollama(prompt)

def _call_huggingface(prompt: str) -> str:
    """Call LLM using Hugging Face Inference API (FREE)."""
    try:
        model = os.getenv('MODEL_NAME', 'google/flan-t5-base')
        api_url = f"https://api-inference.huggingface.co/models/{model}"

        headers = {
            "Authorization": f"Bearer {HUGGING_FACE_TOKEN}",
            "Content-Type": "application/json"
        }

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": MAX_TOKENS,
                "temperature": TEMPERATURE
            }
        }

        response = requests.post(api_url, headers=headers, json=payload, timeout=30)

        if response.status_code != 200:
            return f"Hugging Face error ({response.status_code}): {response.text[:200]}"

        result = response.json()

        # Extract generated text based on response format.
        if isinstance(result, list) and len(result) > 0:
            return result[0].get('generated_text', '').strip()
        if isinstance(result, dict):
            return result.get('generated_text', '').strip()
        return str(result).strip()[:1000]

    except requests.exceptions.RequestException as e:
        return f"Hugging Face request failed: {str(e)}"
    except Exception as e:
        return f"LLM error: {str(e)}"

def _call_openrouter(prompt: str) -> str:
    """Call LLM using OpenRouter API"""
    try:
        model = os.getenv('MODEL_NAME', 'meta-llama/llama-3-8b-instruct')
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
           headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/Akhils696/RAG-evolab",
            },
            json={
                "model": model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": TEMPERATURE,
                "max_tokens": MAX_TOKENS
            },
            timeout=30
        )
        
        if response.status_code != 200:
            return f"OpenRouter API error: {response.text}"
        
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
    
    except requests.exceptions.RequestException as e:
        return f"OpenRouter request failed: {str(e)}"
    except Exception as e:
        return f"LLM error: {str(e)}"

def _call_ollama(prompt: str) -> str:
    """Call LLM using Ollama (local or remote)"""
    try:
        client = Client(host=OLLAMA_HOST)
        response = client.chat(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            options={
                "temperature": TEMPERATURE,
                "num_predict": MAX_TOKENS
            }
        )

        return response["message"]["content"].strip()

    except ResponseError as e:
        return f"Ollama error: {e}"

    except Exception as e:
        return f"Ollama error: {str(e)}"
