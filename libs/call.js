// libs/call.js

let currentCall = null;

export function startCall(userId) {
  if (currentCall) {
    console.warn("Call already in progress.");
    return;
  }

  currentCall = userId;
  showCallUI(userId);
  console.log(`Calling ${userId}...`);
}

export function endCall() {
  if (!currentCall) return;

  hideCallUI(currentCall);
  console.log(`Call with ${currentCall} ended.`);
  currentCall = null;
}

function showCallUI(userId) {
  const callBox = document.createElement('div');
  callBox.id = 'call-box';
  callBox.innerHTML = `
    <div class="call-ui">
      <p>📞 กำลังโทรหา: <strong>${userId}</strong></p>
      <button onclick="window.endCall()">❌ วางสาย</button>
    </div>
  `;
  document.body.appendChild(callBox);
}

function hideCallUI() {
  const callBox = document.getElementById('call-box');
  if (callBox) callBox.remove();
}

// ให้ใช้ใน HTML ได้ด้วย
window.startCall = startCall;
window.endCall = endCall;
