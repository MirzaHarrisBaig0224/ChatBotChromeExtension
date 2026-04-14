// CREATE ROOT
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

  <div class="chat-header">
    <span>AI Assistant</span>
  </div>

  <div id="chat-box" class="chat-box"></div>

  <div class="chat-input">
    <input id="chat-input" placeholder="Ask anything about this page..." />
    <button id="send">➤</button>
  </div>

</div>
`;

root.append(btn, panel);
document.body.appendChild(root);

// TOGGLE PANEL
let open = false;
btn.onclick = () => {
  open = !open;
  panel.classList.toggle("open", open);
};

// GET PAGE CONTENT
function getPageContent() {
  const title = document.title;
  const url = window.location.href;

  // Try to get meaningful content
  let content = "";

  // Prefer main/article content
  const main = document.querySelector("main, article");
  if (main) {
    content = main.innerText;
  } else {
    content = document.body.innerText;
  }

  return `
PAGE TITLE: ${title}
URL: ${url}

CONTENT:
${content.slice(0, 4000)}
  `;
}

// CHAT LOGIC
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");

function addMsg(text, who) {
  const div = document.createElement("div");
  div.style.marginBottom = "8px";
  div.innerHTML = `<b>${who}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("click", (e) => {
  if (e.target.id === "send") {
    const input = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");

    if (!input) return;

    const q = input.value;
    if (!q) return;

    addMsg(q, "You");
    input.value = "";

    chrome.runtime.sendMessage({
      type: "ASK_AI",
      question: q,
      content: getPageContent()
    }, (res) => {
      addMsg(res?.answer || "No response", "AI");
    });
  }
});