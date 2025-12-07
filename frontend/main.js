// Point this to your deployed Worker API
const API_URL = "https://backend.perakalapudianurag.workers.dev/api/chat";

const chatWindow = document.getElementById("chat-window");
const messageInput = document.getElementById("message-input");
const titleInput = document.getElementById("title-input");
const summaryInput = document.getElementById("summary-input");
const sendBtn = document.getElementById("send-btn");
const composerForm = document.getElementById("composer");
const statusPill = document.getElementById("status-pill");
const statusText = document.getElementById("status-text");
const newProjectBtn = document.getElementById("new-project");
const applySummaryBtn = document.getElementById("apply-summary");
const quickPromptButtons = document.querySelectorAll(".quick-prompt");

// A stable project id per browser
let projectId =
  localStorage.getItem("projectId") || crypto.randomUUID();
localStorage.setItem("projectId", projectId);

let messages = []; // we mirror backend history for rendering

function setStatus(mode) {
  const dot = statusPill.querySelector(".status-dot");
  if (!dot) return;
  dot.classList.remove("status-ready", "status-busy");
  if (mode === "busy") {
    dot.classList.add("status-busy");
    statusText.textContent = "Thinking...";
  } else {
    dot.classList.add("status-ready");
    statusText.textContent = "Ready";
  }
}

function renderEmptyState() {
  chatWindow.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "chat-window-empty";
  empty.textContent =
    "Describe your project to get a concrete plan with schedule, roles, tools and a rough budget.";
  chatWindow.appendChild(empty);
}

function renderMessages() {
  chatWindow.innerHTML = "";
  if (!messages.length) {
    renderEmptyState();
    return;
  }
  messages.forEach((msg) => {
    const row = document.createElement("div");
    row.className = `message-row ${msg.role === "user" ? "user" : "assistant"}`;

    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${msg.role}`;

    const meta = document.createElement("div");
    meta.className = "message-meta";

    const roleSpan = document.createElement("span");
    roleSpan.className = "message-role";
    roleSpan.textContent = msg.role === "user" ? "You" : "Copilot";

    const timeSpan = document.createElement("span");
    timeSpan.className = "message-time";
    timeSpan.textContent = msg.time || "";

    meta.appendChild(roleSpan);
    meta.appendChild(timeSpan);

    const body = document.createElement("div");
    body.innerText = msg.content;

    bubble.appendChild(meta);
    bubble.appendChild(body);
    row.appendChild(bubble);
    chatWindow.appendChild(row);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addLocalMessage(role, content) {
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  messages.push({ role, content, time });
  renderMessages();
}

async function sendMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  addLocalMessage("user", trimmed);

  setStatus("busy");
  sendBtn.disabled = true;
  messageInput.disabled = true;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        projectTitle: titleInput.value || "Untitled Project",
        message: trimmed,
      }),
    });

    const data = await res.json();

    // Use backend history if it is provided, otherwise append locally
    if (data.state && Array.isArray(data.state.history)) {
      messages = data.state.history.map((m) => ({
        role: m.role,
        content: m.content,
        time: "",
      }));
      renderMessages();
    } else if (data.reply) {
      addLocalMessage("assistant", data.reply);
    }
  } catch (err) {
    addLocalMessage(
      "assistant",
      "I hit an error talking to the backend. You can try again in a moment."
    );
    console.error(err);
  } finally {
    setStatus("ready");
    sendBtn.disabled = false;
    messageInput.disabled = false;
    messageInput.focus();
  }
}

// Event wiring

composerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value;
  messageInput.value = "";
  sendMessage(text);
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    composerForm.dispatchEvent(new Event("submit"));
  }
});

newProjectBtn.addEventListener("click", () => {
  projectId = crypto.randomUUID();
  localStorage.setItem("projectId", projectId);
  messages = [];
  renderMessages();
});

applySummaryBtn.addEventListener("click", () => {
  const summary = summaryInput.value.trim();
  if (!summary) return;
  messageInput.value = summary;
  messageInput.focus();
});

quickPromptButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const prompt = btn.getAttribute("data-prompt");
    if (!prompt) return;
    messageInput.value = prompt;
    messageInput.focus();
  });
});

// Initial render
renderEmptyState();
setStatus("ready");
