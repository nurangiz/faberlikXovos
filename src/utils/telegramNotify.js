// Telegram Notification Utility for Faberlic Academy
// Bot: @Faberlicuz_bot (ID: 9135418346)

export const TELEGRAM_BOT_TOKEN = '9135418346:AAHCYzKrotvaccOgvYm-RXoGCSD7CKzTDHs';
export const TELEGRAM_BOT_USERNAME = 'Faberlicuz_bot';
export const TELEGRAM_BOT_URL = `https://t.me/${TELEGRAM_BOT_USERNAME}`;

const ADMIN_CHAT_ID_KEY = 'faberlic_admin_telegram_chat_id';

export function getStoredAdminChatId() {
  try {
    return localStorage.getItem(ADMIN_CHAT_ID_KEY) || '';
  } catch (_) {
    return '';
  }
}

export function saveStoredAdminChatId(chatId) {
  try {
    if (chatId) {
      localStorage.setItem(ADMIN_CHAT_ID_KEY, String(chatId).trim());
    } else {
      localStorage.removeItem(ADMIN_CHAT_ID_KEY);
    }
  } catch (_) {}
}

/**
 * Format Tashkent time (UTC+5)
 */
export function getTashkentTimeInfo() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('uz-UZ', { 
    timeZone: 'Asia/Tashkent',
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('uz-UZ', { 
    timeZone: 'Asia/Tashkent',
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return { dateStr, timeStr, full: `${dateStr}, ${timeStr}` };
}

/**
 * Send real-time notification to Telegram Admin when a user registers
 */
export async function notifyTelegramRegistration(userData) {
  try {
    const { dateStr, timeStr } = getTashkentTimeInfo();
    const adminChatId = getStoredAdminChatId();

    const text = `🎉 <b>YANGI O'QUVCHI RO'YXATDAN O'TDI!</b>

👤 <b>Ism-familiya:</b> ${userData.name || "Ko'rsatilmagan"}
📞 <b>Telefon raqami:</b> ${userData.phone || "Ko'rsatilmagan"}
📍 <b>Viloyat / Shahar:</b> ${userData.region || "Sirdaryo"}
📅 <b>Sana:</b> ${dateStr}
⏰ <b>Soat:</b> ${timeStr} (Toshkent vaqti)
⭐ <b>Boshlang'ich ball:</b> ${userData.points || 50} ball
🌐 <b>Manba:</b> faberlikxovos-gold.vercel.app

<i>Faberlic Ayollar & Qizlar Akademiyasi</i>`;

    // 1. Send via Vercel serverless /api/telegram
    try {
      fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'notify_registration',
          user: userData,
          adminChatId: adminChatId || undefined
        })
      }).catch(() => {});
    } catch (_) {}

    // 2. Direct Telegram API call if adminChatId is already known in browser
    if (adminChatId) {
      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text,
            parse_mode: 'HTML'
          })
        });
      } catch (err) {
        console.warn('Direct Telegram notify failed:', err);
      }
    }
  } catch (err) {
    console.error('notifyTelegramRegistration error:', err);
  }
}

/**
 * Send a test message from Admin Panel
 */
export async function sendTestTelegramMessage(chatId) {
  if (!chatId) throw new Error("Iltimos, Telegram Chat ID kiriting!");
  
  const { dateStr, timeStr } = getTashkentTimeInfo();
  const text = `🔔 <b>TEST BILDIRISHNOMA:</b>\n\n` +
    `✅ Hurmatli Rahbar Nurangiz! @${TELEGRAM_BOT_USERNAME} boti sizning profilingiz bilan 100% muvaffaqiyatli bog'landi!\n\n` +
    `📅 Sana: ${dateStr}\n` +
    `⏰ Vaqt: ${timeStr} (Toshkent vaqti)\n\n` +
    `Endi yangi o'quvchilar ro'yxatdan o'tganda ma'lumotlar shu yerga keladi va o'quvchilar savollariga Telegramning o'zidan javob bera olasiz. 🌟`;

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    })
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || "Telegramga xabar yuborishda xatolik");
  }

  saveStoredAdminChatId(chatId);
  return data;
}
