chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "ASK_AI") {

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "Answer ONLY using the provided webpage content."
            },
            {
              role: "user",
              content: `Page:\n${msg.content}\n\nQuestion: ${msg.question}`
            }
          ]
        })
      });

      const data = await res.json();

      console.log("GROQ RESPONSE:", data); // 🔥 DEBUG

      if (data.error) {
        sendResponse({ answer: "Error: " + data.error.message });
        return;
      }

      sendResponse({
        answer: data.choices?.[0]?.message?.content || "Empty response"
      });

    } catch (err) {
      console.error("FETCH ERROR:", err);
      sendResponse({ answer: "Request failed" });
    }

    return true;
  }
});