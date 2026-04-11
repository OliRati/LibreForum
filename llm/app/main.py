from fastapi import FastAPI
from pydantic import BaseModel
import requests
import json
import re

app = FastAPI()

OLLAMA_URL = "http://ollama:11434/api/generate"

class TextRequest(BaseModel):
    text: str


def call_ollama(prompt: str):
    response = requests.post(OLLAMA_URL, json={
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    })
    return response.json()["response"]

def extract_json(text: str):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except:
            return None
    return None

# 1 -> Résumé
@app.post("/summarize")
def summarize(req: TextRequest):
    prompt = f"""
Résume ce fil de discussion en 5 lignes maximum :

{req.text}
"""
    result = call_ollama(prompt)
    return {"summary": result}


# 2 -> Modération
@app.post("/moderate")
def moderate(req: TextRequest):
    prompt = f"""
Tu es un système de modération.

Analyse ce texte et réponds UNIQUEMENT en JSON valide :

{{
  "toxicity": float entre 0 et 1,
  "label": "clean" | "warning" | "toxic"
}}

Texte :
{req.text}
"""

    raw = call_ollama(prompt)

    parsed = extract_json(raw)

    if not parsed:
        return {
            "toxicity": 0,
            "label": "clean",
            "raw": raw
        }

    return parsed


# 3 -> Tags
@app.post("/suggest-tags")
def suggest_tags(req: TextRequest):
    prompt = f"""
Donne 5 tags pertinents pour ce contenu.
Réponds en JSON array.

Contenu :
{req.text}
"""
    result = call_ollama(prompt)
    return {"tags": result}