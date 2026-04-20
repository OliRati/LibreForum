from fastapi import FastAPI
from fastapi.responses import StreamingResponse
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


def stream_ollama(prompt: str):
    with requests.post(OLLAMA_URL, json={
        "model": "mistral",
        "prompt": prompt,
        "stream": True
    }, stream=True, timeout=300) as response:
        for raw_line in response.iter_lines(decode_unicode=True):
            if raw_line is None:
                continue

            if isinstance(raw_line, bytes):
                line = raw_line.decode("utf-8", errors="ignore").strip()
            else:
                line = raw_line.strip()

            if not line:
                continue

            if line.startswith("data:"):
                line = line[len("data:"):].strip()
                if not line:
                    continue

            try:
                payload = json.loads(line)
            except json.JSONDecodeError:
                yield line.encode("utf-8")
                continue

            if isinstance(payload, dict):
                response_text = payload.get("response")
                if response_text is not None:
                    text = str(response_text)
                    if text:
                        yield text.encode("utf-8")

                if payload.get("done"):
                    return
                continue

            yield line.encode("utf-8")

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
Tu es un assistant qui génère des tags pour un forum technique.

Réponds UNIQUEMENT en JSON valide :
[
  "tag1",
  "tag2",
  "tag3",
  "tag4",
  "tag5"
]

Contraintes :
- tags courts (1 ou 2 mots)
- en minuscules
- pertinents

Contenu :
{req.text}
"""

    raw = call_ollama(prompt)

    parsed = extract_json(raw)

    if not parsed:
        return {
            "tags": []
        }

    return {
        "tags": parsed
    }


@app.post("/assist")
def assist(req: dict):
    text = req.get("text", "")
    action = req.get("action", "improve")

    prompts = {
        "improve": "Améliore ce message pour le rendre plus clair et structuré.",
        "correct": "Corrige les fautes d'orthographe et de grammaire.",
        "summarize": "Résume ce message en version courte.",
        "simplify": "Simplifie ce texte pour le rendre plus compréhensible."
    }

    instruction = prompts.get(action, prompts["improve"])

    prompt = f"""
{instruction}

Réponds uniquement avec le texte final.

Texte :
{text}
"""

    result = call_ollama(prompt)

    return {
        "result": result.strip()
    }


@app.post("/assist/stream")
def assist_stream(req: dict):
    text = req.get("text", "")
    action = req.get("action", "improve")

    prompts = {
        "improve": "Améliore ce message pour le rendre plus clair et structuré.",
        "correct": "Corrige les fautes d'orthographe et de grammaire.",
        "summarize": "Résume ce message en version courte.",
        "simplify": "Simplifie ce texte pour le rendre plus compréhensible."
    }

    instruction = prompts.get(action, prompts["improve"])

    prompt = f"""
{instruction}

Réponds uniquement avec le texte final.

Texte :
{text}
"""

    return StreamingResponse(stream_ollama(prompt), media_type="text/plain; charset=utf-8")