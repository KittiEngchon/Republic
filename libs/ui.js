// libs/ui.js

// Toast แจ้งเตือน
export function showToast(message, type = "info", milestone = 0) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // สี milestone (ถ้ามี)
  if (milestone >= 50) toast.style.backgroundColor = "#e74c3c"; // แดง
  else if (milestone >= 10) toast.style.backgroundColor = "#f1c40f"; // เหลือง
  else toast.style.backgroundColor = "#3498db"; // น้ำเงิน

  document.body.appendChild(toast);
  playSound();

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// เล่นเสียงแจ้งเตือน
export function playSound() {
  const audio = new Audio("/assets/notify.mp3");
  audio.play().catch(() => {});
}

// Modal
export function showModal(contentHTML) {
  const modalWrapper = document.createElement("div");
  modalWrapper.className = "modal-wrapper";
  modalWrapper.innerHTML = `
    <div class="modal">
      <div class="modal-content">${contentHTML}</div>
      <button class="modal-close">ปิด</button>
    </div>
  `;
  document.body.appendChild(modalWrapper);
  modalWrapper.querySelector(".modal-close").onclick = () => modalWrapper.remove();
}

// Theme Toggle
export function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

export function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", saved);
}

// ระบบปุ่ม Copy
export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("คัดลอกเรียบร้อย", "success");
  });
}

// โหลด UI เมื่อเริ่มต้น
export function initUI() {
  initTheme();

  // ปุ่ม Toggle
  const toggle = document.querySelector("#toggle-theme");
  if (toggle) {
    toggle.onclick = () => toggleTheme();
  }
}
