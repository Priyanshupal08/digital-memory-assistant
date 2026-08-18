import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing from backend/.env")

client = genai.Client(api_key=api_key)


def ask_ai(question: str, context: str) -> str:

    prompt = f"""
You are a Digital Memory Assistant.

Answer the user's question using only the information
provided in the indexed document context.

If the answer cannot be found in the documents, say:
"I couldn't find that information in your indexed documents."

Do not make up information.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text or "I couldn't generate an answer."