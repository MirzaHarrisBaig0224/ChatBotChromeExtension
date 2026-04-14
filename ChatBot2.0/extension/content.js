// ROOT
const root = document.createElement("div");
root.id = "ai-root";

// BUTTON
const btn = document.createElement("div");
btn.id = "ai-btn";
btn.innerText = "🤖";

// PANEL
const panel = document.createElement("div");
panel.id = "ai-panel";

panel.innerHTML = `
<div class="chat-container">
  <div class="chat-header">AI Assistant</div>
  <div id="chat-box" class="chat-box"></div>
  <div class="chat-input">
    <input id="chat-input" placeholder="Ask anything..." />
    <button id="send">➤</button>
  </div>
</div>
`;

root.append(btn, panel);
document.body.appendChild(root);

// TOGGLE
let open = false;
btn.onclick = () => {
  open = !open;
  panel.classList.toggle("open", open);
};

// CHAT
const chatBox = document.getElementById("chat-box");

function addMsg(text, who) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${who}:</b> ${text}`;
  chatBox.appendChild(div);
}

// SEND (event delegation for YouTube etc.)
document.addEventListener("click", (e) => {
  if (e.target.id === "send") {
    const input = document.getElementById("chat-input");
    const q = input.value;
    if (!q) return;

    addMsg(q, "You");
    input.value = "";

    chrome.runtime.sendMessage({
      type: "ASK_AI",
      question: q,
      url: window.location.href
    }, (res) => {
      addMsg(res?.answer || "No response", "AI");
    });
  }
});