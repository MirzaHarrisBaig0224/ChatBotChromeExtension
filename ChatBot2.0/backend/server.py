from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
import requests

app = Flask(__name__)

GROQ_API_KEY = "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"

def ask_groq(content, question):
    res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": "Answer based on webpage content."},
                {"role": "user", "content": f"{content}\n\nQuestion: {question}"}
            ]
        }
    )
    return res.json()["choices"][0]["message"]["content"]

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    url = data.get("url")
    question = data.get("question")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        content = page.inner_text("body")[:5000]

        browser.close()

    answer = ask_groq(content, question)

    return jsonify({"answer": answer})

app.run(port=5000)