// libs/token.js

import { showToast } from './ui.js';

const TIP_FILE = 'data/token-tips-all.json';
const MILESTONE_FILE = 'data/milestone-log.json';

const MILESTONES = [10, 50, 100, 250, 500];

export async function tipUser(from, to, amount, tokenType = 'm_token') {
  if (!from || !to || !amount || amount <= 0) return;

  const tips = await loadJSON(TIP_FILE);
  const now = new Date().toISOString();

  // Save tip transaction
  tips.push({
    from,
    to,
    amount,
    tokenType,
    timestamp: now
  });

  await saveJSON(TIP_FILE, tips);

  // Calculate total tips received by `to`
  const userTotal = tips
    .filter(t => t.to === to && t.tokenType === tokenType)
    .reduce((sum, t) => sum + t.amount, 0);

  // Check milestone
  const milestone = MILESTONES.find(m => userTotal === m);
  if (milestone) {
    const milestones = await loadJSON(MILESTONE_FILE);
    milestones.push({
      timestamp: now,
      user: to,
      milestone,
      totalTipReceived: userTotal,
      level: getMilestoneLevel(milestone),
      tokenType,
      notified: true
    });
    await saveJSON(MILESTONE_FILE, milestones);

    // Show milestone toast
    const color = getMilestoneColor(milestone);
    const msg = `🎉 ${to} ได้รับ tip สะสมถึง ${userTotal} Token แล้ว!`;
    showToast(msg, color, true);
    playMilestoneSound();
  }
}

function getMilestoneColor(milestone) {
  if (milestone >= 500) return 'purple';
  if (milestone >= 100) return 'gold';
  if (milestone >= 50) return 'red';
  if (milestone >= 10) return 'orange';
  return 'gray';
}

function getMilestoneLevel(milestone) {
  if (milestone >= 500) return 'Diamond';
  if (milestone >= 100) return 'Gold';
  if (milestone >= 50) return 'Silver';
  if (milestone >= 10) return 'Bronze';
  return 'Newbie';
}

function playMilestoneSound() {
  const audio = new Audio('/assets/sfx/milestone.mp3');
  audio.play().catch(() => {});
}

// JSON helpers
async function loadJSON(path) {
  const res = await fetch(path);
  return res.ok ? await res.json() : [];
}

async function saveJSON(path, data) {
  // NOTE: You may need to use API / backend endpoint in production
  console.log(`[saveJSON] ${path}`, data);
}
