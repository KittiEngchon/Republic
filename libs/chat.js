// libs/chat.js

const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

const userName = localStorage.getItem('username') || 'Guest';
const today = new Date().toISOString().split('T')[0];
const chatLogPath = `data/chat-log-${today}.json`;

let messages = [];

// โหลดข้อความย้อนหลัง
async function loadChatLog() {
  try {
    const res = await fetch(chatLogPath);
    if (res.ok) {
      messages = await res.json();
      messages.forEach(msg => renderMessage(msg));
    }
  } catch (e) {
    console.warn("ยังไม่มี log วันนี้", e);
  }
}

// แสดงข้อความ
function renderMessage({ user, text, time }) {
  const el = document.createElement('div');
  el.className = 'chat-message';
  el.innerHTML = `<b>${user}</b>: ${text} <small>${time}</small>`;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ส่งข้อความ
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const msg = {
    user: userName,
    text,
    time: new Date().toLocaleTimeString()
  };

  messages.push(msg);
  renderMessage(msg);
  chatInput.value = '';

  // บันทึก log
  await saveChatLog();
}

// บันทึกลง log file (mock only)
async function saveChatLog() {
  try {
    await fetch(`/save-chat-log?file=${chatLogPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages)
    });
  } catch (e) {
    console.error("บันทึก log ไม่สำเร็จ", e);
  }
}

// Event
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// เริ่มต้นโหลด
loadChatLog();
