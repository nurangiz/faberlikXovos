// Vercel Serverless Function: Telegram Bot Webhook & Registration Notifier
// Bot: @Faberlicuz_bot (ID: 9135418346)

const BOT_TOKEN = '9135418346:AAHCYzKrotvaccOgvYm-RXoGCSD7CKzTDHs';
const BOT_SELF_ID = '9135418346';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const CLOUD_SYNC_URL = 'https://ntfy.sh/fl_academy_uz_2026_sync';

let cachedAdminChatId = null;

async function getAdminChatId() {
  if (cachedAdminChatId && String(cachedAdminChatId) !== BOT_SELF_ID) {
    return cachedAdminChatId;
  }

  try {
    const res = await fetch(`${CLOUD_SYNC_URL}/json?poll=1&since=all`);
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          const data = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
          if (data && data.type === 'ADMIN_TELEGRAM_CONNECTED' && data.chatId) {
            const cid = String(data.chatId).trim();
            // Ignore if it was the bot's own ID
            if (cid && cid !== BOT_SELF_ID) {
              cachedAdminChatId = cid;
              return cachedAdminChatId;
            }
          }
        } catch (_) {}
      }
    }
  } catch (e) {
    console.error('Error fetching admin chat id:', e);
  }

  return null;
}

async function setAdminChatId(chatId, userName = '') {
  const cid = String(chatId).trim();
  if (!cid || cid === BOT_SELF_ID) return;

  cachedAdminChatId = cid;
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: 'POST',
      headers: { 'Title': 'ADMIN_TELEGRAM_CONNECTED', 'Priority': 'high' },
      body: JSON.stringify({
        type: 'ADMIN_TELEGRAM_CONNECTED',
        chatId: cid,
        userName,
        connectedAt: new Date().toISOString()
      })
    });
  } catch (e) {
    console.error('Failed to broadcast admin connection:', e);
  }
}

async function sendTelegramMessage(chatId, text, extra = {}) {
  const cid = String(chatId).trim();
  if (!cid || cid === BOT_SELF_ID) {
    console.warn('Cannot send message to bot self ID or empty chat ID:', cid);
    return { ok: false, error: 'Cannot send message to bot self' };
  }

  try {
    // 1. Try sending with HTML parse_mode
    let res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cid,
        text,
        parse_mode: 'HTML',
        ...extra
      })
    });
    let data = await res.json();

    // 2. Fallback to plain text if HTML parsing failed
    if (!data.ok && data.description && data.description.includes("can't parse entities")) {
      const cleanText = text.replace(/<[^>]*>/g, '');
      res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cid,
          text: cleanText,
          ...extra
        })
      });
      data = await res.json();
    }

    return data;
  } catch (err) {
    console.error('Telegram sendMessage error:', err);
    return { ok: false, error: err.message };
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Status or Info
  if (req.method === 'GET') {
    const adminId = await getAdminChatId();
    return res.status(200).json({
      ok: true,
      bot: '@Faberlicuz_bot',
      adminConnected: Boolean(adminId),
      adminChatId: adminId || null,
      time: new Date().toISOString()
    });
  }

  // 2. POST: Handle Webhook or Registration Notification
  if (req.method === 'POST') {
    const body = req.body || {};

    // A. Website Registration Notification
    if (body.action === 'notify_registration' || body.type === 'NEW_REGISTRATION') {
      const user = body.user || body.data || body;
      const adminId = body.adminChatId || await getAdminChatId();

      const tashkentTime = new Date().toLocaleString('uz-UZ', { 
        timeZone: 'Asia/Tashkent',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const messageText = `🎉 <b>YANGI O'QUVCHI RO'YXATDAN O'TDI!</b>\n\n` +
        `👤 <b>Ism-familiya:</b> ${user.name || "Ko'rsatilmagan"}\n` +
        `📞 <b>Telefon raqami:</b> ${user.phone || "Ko'rsatilmagan"}\n` +
        `📍 <b>Viloyat / Shahar:</b> ${user.region || "Sirdaryo"}\n` +
        `📅 <b>Vaqti:</b> ${tashkentTime} (Toshkent vaqti)\n` +
        `⭐ <b>Boshlang'ich ball:</b> ${user.points || 50} ball\n` +
        `🌐 <b>Manba:</b> faberlikxovos-gold.vercel.app\n\n` +
        `<i>Faberlic Ayollar & Qizlar Akademiyasi</i>`;

      if (adminId && adminId !== BOT_SELF_ID) {
        const sendResult = await sendTelegramMessage(adminId, messageText);
        return res.status(200).json({ ok: true, sentToAdmin: true, adminId, sendResult });
      } else {
        return res.status(200).json({ 
          ok: true, 
          sentToAdmin: false, 
          message: "Admin hali @Faberlicuz_bot ga 080910 deb yozmagan." 
        });
      }
    }

    // B. Save Admin ID directly from website Admin Panel
    if (body.action === 'set_admin_chat_id' && body.chatId) {
      const cid = String(body.chatId).trim();
      if (cid && cid !== BOT_SELF_ID) {
        await setAdminChatId(cid, body.name || 'Admin');
        await sendTelegramMessage(
          cid,
          `✅ <b>Salom, Hurmatli Rahbar Nurangiz!</b>\n\nSiz @Faberlicuz_bot ga rasmiy <b>ADMIN</b> sifatida muvaffaqiyatli ulandingiz! Endi saytdan ro'yxatdan o'tganlar shu yerga keladi va o'quvchilar savollariga javob bera olasiz. 🌟`
        );
        return res.status(200).json({ ok: true, adminChatId: cid });
      }
      return res.status(400).json({ error: "Noto'g'ri Chat ID" });
    }

    // C. Telegram Update from Webhook
    const update = body;

    // Handle Callback Queries (when buttons are clicked in Telegram)
    if (update.callback_query) {
      const cq = update.callback_query;
      const cqChatId = cq.message?.chat?.id || cq.from?.id;
      const data = cq.data || '';

      if (data === 'admin_auth') {
        await sendTelegramMessage(
          cqChatId,
          `🔑 <b>ADMIN TASDIQLASH:</b>\n\nIltimos, maxfiy admin parolingizni (<b>080910</b>) yuboring!`
        );
      } else if (data === 'ask_question') {
        await sendTelegramMessage(
          cqChatId,
          `✍️ <b>Savolingizni yozing:</b>\n\nDarslar, ro'yxatdan o'tish yoki Faberlic biznesi bo'yicha savolingizni shu yerga yozib yuboring. Rahbariyatimiz sizga tez orada javob yozadilar! 🌸`
        );
      }
      // Answer callback query so button stops loading
      try {
        await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: cq.id })
        });
      } catch (_) {}

      return res.status(200).send('OK');
    }

    // Handle Messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = (msg.text || '').trim();
      const from = msg.from || {};
      const fullName = `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'Foydalanuvchi';
      const username = from.username ? `@${from.username}` : "yo'q";

      const currentAdminId = await getAdminChatId();

      // 1. Check if user is sending the passcode 080910 or /admin
      if (text.includes('080910') || text === '/admin' || text === '/start 080910') {
        await setAdminChatId(chatId, fullName);
        await sendTelegramMessage(
          chatId,
          `👑 <b>TABRIKLAYMIZ, HURMATLI RAHBAR NURANGIZ!</b>\n\n` +
          `Siz <b>@Faberlicuz_bot</b> tizimiga <b>BOSH ADMIN</b> sifatida muvaffaqiyatli ulandingiz!\n\n` +
          `📌 <b>Sizning shaxsiy Chat ID:</b> <code>${chatId}</code>\n\n` +
          `🔔 <b>Endi:</b>\n` +
          `1️⃣ Saytda kim qachon, soat nechida va qayerdan ro'yxatdan o'tsa, darhol shu yerga to'liq ma'lumot keladi.\n` +
          `2️⃣ O'quvchilar botga savol yozsa, sizga keladi. Siz Telegramda o'sha xabarga shunchaki <b>"Reply" (Javob berish)</b> qilib yozsangiz, javobingiz to'g'ridan-to'g'ri o'quvchiga boradi!\n\n` +
          `<i>Faberlic Ayollar & Qizlar Akademiyasi Boshqaruv Tizimi</i>`
        );
        return res.status(200).send('OK');
      }

      // 2. Check if message is from the ADMIN
      if (currentAdminId && String(chatId) === String(currentAdminId)) {
        // Admin replied to a forwarded question
        if (msg.reply_to_message && msg.reply_to_message.text) {
          const repliedText = msg.reply_to_message.text;
          const match = repliedText.match(/#user_(\d+)/);

          if (match && match[1]) {
            const studentChatId = match[1];
            const adminReplyText = text || 'Rahmat, murojaatingiz qabul qilindi!';

            // Send reply directly to the student
            const studentResult = await sendTelegramMessage(
              studentChatId,
              `💌 <b>Faberlic Akademiya Rahbariyatidan Javob:</b>\n\n${adminReplyText}\n\n<i>Savollaringiz bo'lsa, yana bemalol yozishingiz mumkin! 🌸</i>`
            );

            if (studentResult.ok) {
              await sendTelegramMessage(chatId, `✅ <b>Javobingiz o'quvchiga muvaffaqiyatli yetkazildi!</b>`);
            } else {
              await sendTelegramMessage(chatId, `⚠️ Xatolik: ${studentResult.description || 'Yetkazib bo\'lmadi'}`);
            }
            return res.status(200).send('OK');
          }
        }

        // Admin typed /reply <id> <text>
        if (text.startsWith('/reply ')) {
          const parts = text.split(' ');
          const targetId = parts[1];
          const replyBody = parts.slice(2).join(' ');

          if (targetId && replyBody) {
            const result = await sendTelegramMessage(
              targetId,
              `💌 <b>Faberlic Akademiya Rahbariyatidan Javob:</b>\n\n${replyBody}\n\n<i>Savollaringiz bo'lsa, yana bemalol yozishingiz mumkin! 🌸</i>`
            );
            if (result.ok) {
              await sendTelegramMessage(chatId, `✅ Javob o'quvchiga yetkazildi!`);
            } else {
              await sendTelegramMessage(chatId, `⚠️ Xatolik: ${result.description}`);
            }
            return res.status(200).send('OK');
          }
        }

        // Admin typed /start
        if (text.startsWith('/start')) {
          await sendTelegramMessage(
            chatId,
            `👑 <b>Assalomu alaykum, Hurmatli Rahbar Nurangiz!</b>\n\n` +
            `Siz @Faberlicuz_bot ga <b>ADMIN</b> sifatida ulangansiz.\n` +
            `Shaxsiy Chat ID'ingiz: <code>${chatId}</code>\n\n` +
            `Hozirda barcha ro'yxatdan o'tishlar va o'quvchilar savollari sizga shu yerga kelmoqda. 🌸`
          );
          return res.status(200).send('OK');
        }
      }

      // 3. User typed /start
      if (text.startsWith('/start')) {
        await sendTelegramMessage(
          chatId,
          `Assalomu alaykum, <b>${fullName}</b>! 🌸\n\n` +
          `<b>Faberlic Ayollar va Qizlar Akademiyasi</b> rasmiy yordamchi botiga xush kelibsiz!\n\n` +
          `Agar darslar, biznes boshlash, ro'yxatdan o'tish yoki mahsulotlar bo'yicha savolingiz bo'lsa, xabaringizni shu yerga yozib qoldiring. Rahbariyatimiz sizga tez orada javob yozadilar! ✨\n\n` +
          `🌐 Rasmiy saytimiz: <a href="https://faberlikxovos-gold.vercel.app">faberlikxovos-gold.vercel.app</a>`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✍️ Savol Berish", callback_data: "ask_question" },
                  { text: "🌐 Rasmiy Sayt", url: "https://faberlikxovos-gold.vercel.app" }
                ],
                [
                  { text: "👑 Men Adminman (080910)", callback_data: "admin_auth" }
                ]
              ]
            }
          }
        );
        return res.status(200).send('OK');
      }

      // 4. Any question / message sent by user:
      const tashkentTime = new Date().toLocaleString('uz-UZ', { 
        timeZone: 'Asia/Tashkent',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      // A. Acknowledge the user
      await sendTelegramMessage(
        chatId,
        `Rahmat, <b>${fullName}</b>! Savolingiz Faberlic Akademiyasi rahbari Nurangiz Nurbeqqiziga yetkazildi. Tez orada javob olasiz! 🌸`
      );

      // B. Forward to Admin if connected
      if (currentAdminId && currentAdminId !== BOT_SELF_ID) {
        await sendTelegramMessage(
          currentAdminId,
          `📩 <b>YANGI O'QUVCHI SAVOLI!</b>\n\n` +
          `👤 <b>Kimdan:</b> ${fullName} (${username})\n` +
          `🆔 <b>ID:</b> #user_${chatId}\n` +
          `⏰ <b>Vaqti:</b> ${tashkentTime}\n\n` +
          `❓ <b>Savol / Murojaat:</b>\n` +
          `${text || '[Rasm yoki Fayl yuborildi]'}\n\n` +
          `-----------------------------------\n` +
          `👉 <b>Javob berish uchun:</b> Ushbu xabarga Telegramda <i>"Reply" (Javob berish)</i> qilib yozing yoki <code>/reply ${chatId} Javobingiz</code> deb yozing!`
        );
      } else {
        console.log(`User ${chatId} asked question, admin not connected yet. Prompting admin setup.`);
      }

      return res.status(200).send('OK');
    }

    return res.status(200).send('OK');
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
