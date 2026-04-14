chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ASK_AI") {

    fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: msg.url,
        question: msg.question
      })
    })
    .then(res => res.json())
    .then(data => sendResponse({ answer: data.answer }))
    .catch(() => sendResponse({ answer: "Backend error" }));

    return true;
  }
});