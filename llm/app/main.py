from fastapi import FastAPI
import requests
import os

app = FastAPI()

OLLAMA_URL = os.getenv("OLLAMA_HOST", "http://ollama:11434")

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/summarize")
def summarize(data: dict):
    response = requests.post(f"{OLLAMA_URL}/api/generate", json={
        "model": "mistral",
        "prompt": f"Résume ce texte:\n{data['text']}"
    })

    return response.json()