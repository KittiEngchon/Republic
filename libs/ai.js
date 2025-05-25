// libs/ai.js

const AI_PERSONALITIES = {
  "แม่ชี": {
    intro: "สวัสดีจ้ะ ลูกๆ วันนี้มีอะไรในใจบ้างหรือเปล่า?",
    tone: "เมตตา",
    style: "ให้ข้อคิดทางจิตวิญญาณ",
  },
  "โลกี": {
    intro: "เฮ้~ อยากคุยเรื่องเร่าร้อนหรือเรื่องโลกีย์ใช่มั้ยล่ะ?",
    tone: "เย้าแหย่",
    style: "แรงแต่มีเหตุผล",
  },
  "เทรดเดอร์สาวสวย": {
    intro: "ว้าว! กราฟวันนี้แรงนะ! สนใจเหรียญตัวไหนคะ?",
    tone: "มั่นใจ",
    style: "วิเคราะห์เชิงลึก",
  },
  "ที่ปรึกษาทางการเงิน": {
    intro: "สวัสดีครับ คุณมีเป้าหมายทางการเงินระยะไหนครับ?",
    tone: "มืออาชีพ",
    style: "ตรรกะการจัดพอร์ต",
  }
};

let logicMemory = {};  // จดจำรูปแบบคำถาม/คำตอบ
let chatLogs = [];     // สำหรับ log บทสนทนา

// พูดเริ่มต้น
export function aiIntro(name) {
  return AI_PERSONALITIES[name]?.intro || "พร้อมคุยแล้วครับ";
}

// วิเคราะห์คำถาม
function analyzeQuestion(input) {
  const lower = input.toLowerCase();
  if (lower.includes("ความรัก") || lower.includes("แฟน")) return "ความรัก";
  if (lower.includes("เงิน") || lower.includes("ลงทุน")) return "การเงิน";
  if (lower.includes("ศีล") || lower.includes("บุญ")) return "ศีลธรรม";
  if (lower.includes("เหรียญ") || lower.includes("คริปโต")) return "คริปโต";
  return "ทั่วไป";
}

// ตอบกลับจากตรรกะ
export function aiRespond(name, message) {
  const topic = analyzeQuestion(message);
  const personality = AI_PERSONALITIES[name];

  const responseBank = {
    "ความรัก": {
      "แม่ชี": "ความรักที่มั่นคงต้องเริ่มจากรักตัวเองและเคารพกันและกัน",
      "โลกี": "เธอคิดว่าเรื่องรักมันจะซับซ้อนขนาดนั้นเชียวเหรอ 😉",
    },
    "การเงิน": {
      "ที่ปรึกษาทางการเงิน": "ควรมีเงินสำรองอย่างน้อย 3 เดือนก่อนเริ่มลงทุนครับ",
      "เทรดเดอร์สาวสวย": "ลองดูแนวต้านของ BTC ที่ 70K ถ้าทะลุไปได้คือโอกาสเลยค่ะ",
    },
    "ศีลธรรม": {
      "แม่ชี": "ศีล 5 เป็นพื้นฐานของจิตใจที่สงบสุขจ้ะ",
    },
    "คริปโต": {
      "เทรดเดอร์สาวสวย": "วันนี้ Ethereum ฟื้นตัวดีมากเลย ลองเช็ก RSI ดูนะคะ",
      "ที่ปรึกษาทางการเงิน": "ต้องประเมินความเสี่ยงก่อนจะ All-in ครับ",
    },
    "ทั่วไป": {
      "แม่ชี": "เรื่องนี้แม้แม่ชีไม่รู้ลึก แต่จะตั้งใจฟังเสมอจ้ะ",
      "โลกี": "ก็พูดมาเลย ไม่ต้องอ้อม 😉",
    }
  };

  const reply = responseBank[topic]?.[name] || "น่าสนใจมาก เดี๋ยวขอคิดก่อนนะ...";
  chatLogs.push({ from: "user", msg: message });
  chatLogs.push({ from: name, msg: reply });

  learnLogic(message, reply);  // บันทึกตรรกะเรียนรู้

  return reply;
}

// ระบบเรียนรู้พื้นฐานจากข้อความเดิม
function learnLogic(question, answer) {
  const key = question.trim().toLowerCase();
  if (!logicMemory[key]) {
    logicMemory[key] = {
      count: 1,
      lastAnswer: answer,
    };
  } else {
    logicMemory[key].count++;
    logicMemory[key].lastAnswer = answer;
  }
}

// เรียกดูตรรกะที่เคยจำไว้
export function getMemory() {
  return logicMemory;
}

// ดึง log เพื่อเก็บรายวัน
export function getChatLog() {
  return chatLogs;
}

// รีเซ็ต log (เก็บใหม่วันถัดไป)
export function resetChatLog() {
  chatLogs = [];
}
