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
Tu es un assistant de résumé expert.

Règles strictes :
- Conserver la langue originale du texte (français reste français, anglais reste anglais)
- Maximum 5 lignes
- Style concis et neutre
- Garde les points clés du débat
- Ne pas ajouter d'opinion personnelle
- Utilise des phrases complètes

Texte à résumer :
{req.text}
"""
    result = call_ollama(prompt)
    return {"summary": result}


# 2 -> Modération
@app.post("/moderate")
def moderate(req: TextRequest):
    prompt = f"""
Tu es un système de modération de contenu.

Analyse le texte suivant et retourne UNIQUEMENT un JSON valide sans commentaire :

{{
  "toxicity": float entre 0.0 et 1.0 (précision 2 décimales),
  "label": "clean" si toxicity < 0.3,
          "warning" si toxicity entre 0.3 et 0.7,
          "toxic" si toxicity > 0.7
}}

Critères d'analyse :
- Insultes, menaces, haine
- Harcèlement, discrimination
- Contenu violent ou sexuellement explicite

Texte à analyser :
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
Tu es un assistant de catégorisation pour forum technique.

Génère 5 tags pertinents UNIQUEMENT en JSON valide :

{{
  "tags": [
    "tag1",
    "tag2",
    "tag3",
    "tag4",
    "tag5"
  ]
}}

Contraintes strictes :
- 5 tags maximum
- 1 à 2 mots par tag
- minuscules uniquement
- pas de répétitions
- pertinents pour le contenu technique
- variés (pas tous sur le même sujet)

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
        "improve": f"""Tu es un outil de réécriture de texte automatique. Tu ne réponds jamais aux questions, tu ne traduis jamais, tu ne commentes jamais.

RÈGLE ABSOLUE : Tu retournes UNIQUEMENT le texte réécrit, rien d'autre.

Contraintes strictes :
- Conserver la langue originale du texte (français reste français, anglais reste anglais)
- Conserver le sens et les idées exactes de l'auteur
- Améliorer uniquement : la clarté, la structure, la ponctuation, la grammaire
- Ne pas ajouter d'informations, d'opinions ou de contenu nouveau
- Ne pas répondre si le texte est une question — la réécrire uniquement
- Ne pas inclure de phrase d'introduction ou de conclusion
- Ne pas inclure de guillemets autour du résultat

Si le texte d'entrée est : "comment sa marche ?"
Tu retournes : "Comment est-ce que cela fonctionne ?"
Et rien d'autre.""",
        "correct": "Corrige les fautes d'orthographe et de grammaire.",
        "summarize": "Résume ce message en version courte.",
        "simplify": "Simplifie ce texte pour le rendre plus compréhensible."
    }

    instruction = prompts.get(action, prompts["improve"])

    prompt = f"""
{instruction}

Réponds uniquement avec le texte final.

Texte à traiter :


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
        "improve": f"""Tu es un outil de réécriture de texte automatique. Tu ne réponds jamais aux questions, tu ne traduis jamais, tu ne commentes jamais.

RÈGLE ABSOLUE : Tu retournes UNIQUEMENT le texte réécrit, rien d'autre.

Contraintes strictes :
- Conserver la langue originale du texte (français reste français, anglais reste anglais)
- Conserver le sens et les idées exactes de l'auteur
- Améliorer uniquement : la clarté, la structure, la ponctuation, la grammaire
- Ne pas ajouter d'informations, d'opinions ou de contenu nouveau
- Ne pas répondre si le texte est une question — la réécrire uniquement
- Ne pas inclure de phrase d'introduction ou de conclusion
- Ne pas inclure de guillemets autour du résultat

Si le texte d'entrée est : "comment sa marche ?"
Tu retournes : "Comment est-ce que cela fonctionne ?"
Et rien d'autre.""",
        "correct": "Corrige les fautes d'orthographe et de grammaire.",
        "summarize": "Résume ce message en version courte.",
        "simplify": "Simplifie ce texte pour le rendre plus compréhensible."
    }

    instruction = prompts.get(action, prompts["improve"])

    prompt = f"""
{instruction}

Réponds uniquement avec le texte final.

Texte à traiter :
{text}
"""

    return StreamingResponse(stream_ollama(prompt), media_type="text/plain; charset=utf-8")