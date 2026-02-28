import json
import re
from groq import Groq
from app.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are an expert legal document analyst. Help ordinary people understand complex legal documents.

Analyze the legal document and respond with ONLY a valid JSON object. No markdown, no code fences, just raw JSON.

The JSON must have exactly these fields:
{
  "summary": "A clear 3-5 sentence plain-English explanation of what this document is about and what the person is agreeing to.",
  "documentType": "One of: rental | employment | nda | terms | loan | service | other",
  "riskClauses": [
    {
      "clause": "The risky clause from the document",
      "explanation": "Plain-English explanation of why this is risky",
      "severity": "high | medium | low"
    }
  ],
  "keyTerms": [
    {
      "term": "Term name e.g. Notice Period, Monthly Rent, Penalty",
      "value": "The value e.g. 30 days, Rs. 15000"
    }
  ]
}

Rules:
- Write for someone with NO legal knowledge
- Find at least 3-5 risk clauses if they exist
- Extract at least 3-5 key terms
- severity: high = very risky, medium = notable, low = minor
- Return ONLY raw JSON, nothing else"""


def analyze_document(text: str) -> dict:
    """Send extracted PDF text to Groq and return structured analysis."""
    truncated_text = text[:12000]

    if not truncated_text.strip():
        raise ValueError("Document appears to be empty or unreadable.")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Analyze this legal document:\n\n{truncated_text}"},
        ],
        temperature=0.2,
        max_tokens=4096,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()

    # Clean up any markdown fences just in case
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON. Please try again.")

    result.setdefault("summary", "Summary not available.")
    result.setdefault("documentType", "other")
    result.setdefault("riskClauses", [])
    result.setdefault("keyTerms", [])

    return result