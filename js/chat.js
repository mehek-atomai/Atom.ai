import { GEMINI_API_KEY, GEMINI_MODEL } from "./config.js";

const SYSTEM_PROMPT = `You are the astronomy assistant embedded in a website called Atom.ai. Answer the user's question about space, astronomy, or the objects in our Solar System clearly and conversationally in 3-5 sentences. If their question isn't related to astronomy or space, gently redirect them to ask something space-related instead of answering it.

Never greet the user or introduce yourself (no "Hello", no "I'm your astronomy assistant") — this is an ongoing conversation, so just answer directly every time, including the very first message.

After your answer, always add a new line that says exactly "RELATED FACTS:" followed by 2-3 short, genuinely interesting (not commonly known) facts related to the topic, each on its own line starting with "- ".`;

const toggle = document.getElementById("chatToggle");
const panel = document.getElementById("chatPanel");
const closeBtn = document.getElementById("chatClose");
const clearBtn = document.getElementById("chatClear");
const messagesEl = document.getElementById("chatMessages");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSend");

let history = [];

toggle.addEventListener("click", () => {
  panel.classList.toggle("open");
  if (panel.classList.contains("open")) input.focus();
});
closeBtn.addEventListener("click", () => panel.classList.remove("open"));
clearBtn.addEventListener("click", () => {
  history = [];
  messagesEl.innerHTML = "";
});

function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "chatMsg user";
  div.textContent = text;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function addTypingIndicator() {
  const div = document.createElement("div");
  div.className = "chatMsg ai";
  div.innerHTML = `<div class="chatTyping"><span></span><span></span><span></span></div>`;
  messagesEl.appendChild(div);
  scrollToBottom();
  return div;
}

function renderAiMessage(container, rawText) {
  const [answerPart, factsPart] = splitAnswerAndFacts(rawText);
  container.innerHTML = "";

  const answerEl = document.createElement("div");
  answerEl.className = "aiAnswer";
  answerEl.textContent = answerPart;
  container.appendChild(answerEl);

  if (factsPart.length) {
    const factsWrap = document.createElement("div");
    factsWrap.className = "chatFacts";
    const title = document.createElement("div");
    title.className = "chatFactsTitle";
    title.textContent = "Related Facts";
    factsWrap.appendChild(title);
    const ul = document.createElement("ul");
    factsPart.forEach((fact) => {
      const li = document.createElement("li");
      li.textContent = fact;
      ul.appendChild(li);
    });
    factsWrap.appendChild(ul);
    container.appendChild(factsWrap);
  }
  scrollToBottom();
}

function splitAnswerAndFacts(text) {
  const marker = /RELATED FACTS:/i;
  const match = text.match(marker);
  if (!match) return [text.trim(), []];
  const answer = text.slice(0, match.index).trim();
  const factsBlock = text.slice(match.index + match[0].length).trim();
  const facts = factsBlock
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  return [answer, facts];
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showError(container, message) {
  container.className = "chatMsg error";
  container.textContent = message;
}

async function askGemini(question) {
  if (!GEMINI_API_KEY) {
    throw new Error("The AI chat isn't set up yet — no API key configured.");
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const contents = [...history, { role: "user", parts: [{ text: question }] }];
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
    })
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Free usage limit reached for now — try again in a bit.");
    throw new Error("Something went wrong reaching the AI. Please try again.");
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("The AI didn't return an answer. Please try again.");

  history.push({ role: "user", parts: [{ text: question }] });
  history.push({ role: "model", parts: [{ text }] });
  return text;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  input.value = "";
  sendBtn.disabled = true;
  addUserMessage(question);
  const aiContainer = addTypingIndicator();

  try {
    const answer = await askGemini(question);
    renderAiMessage(aiContainer, answer);
  } catch (err) {
    showError(aiContainer, err.message || "Something went wrong. Please try again.");
  } finally {
    sendBtn.disabled = false;
  }
});
