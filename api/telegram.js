// Vercel Serverless Function: Telegram Bot Webhook & Registration Notifier
// Bot: @Faberlicuz_bot (ID: 9135418346)

const BOT_TOKEN = '9135418346:AAHCYzKrotvaccOgvYm-RXoGCSD7CKzTDHs';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const CLOUD_SYNC_URL = 'https://ntfy.sh/fl_academy_uz_2026_sync';

// In-memory fallback for warm lambdas; persistent via cloud sync bus
let cachedAdminChatId = null;

async function getAdminChatId() {
  if (cachedAdminChatId) return cachedAdminChatId;

  // Try fetching latest admin chat id from cloud bus
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
            cachedAdminChatId = data.chatId;
            return cachedAdminChatId;
          }
        } catch (_) {}
      }
    }
  } catch (e) {
    console.error('Error fetching admin chat id from cloud:', e);
  }

  return cachedAdminChatId;
}

async function setAdminChatId(chatId, userName = '') {
  cachedAdminChatId = chatId;
  // Broadcast to cloud bus so all devices & serverless instances know the admin
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: 'POST',
      headers: { 'Title': 'ADMIN_TELEGRAM_CONNECTED', 'Priority': 'high' },
      body: JSON.stringify({
        type: 'ADMIN_TELEGRAM_CONNECTED',
        chatId: String(chatId),
        userName,
        connectedAt: new Date().toISOString()
      })
    });
  } catch (e) {
    console.error('Failed to broadcast admin connection to cloud:', e);
  }
}

async function sendTelegramMessage(chatId, text, extra = {}) {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...extra
      })
    });
    return await res.json();
  } catch (err) {
    console.error('Telegram sendMessage error:', err);
    return { ok: false, error: err.message };
  }
}

export default async function handler(req, res) {
  // Enable CORS
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

  // 2. POST: Handle either Telegram Webhook or Registration Notification
  if (req.method === 'POST') {
    const body = req.body || {};

    // A. Internal notification from Website: "New user registered"
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

      const messageText = `🎉 <b>YANGI O'QUVCHI RO'YXATDAN O'TDI!</b>

👤 <b>Ism-familiya:</b> ${user.name || "Ko'rsatilmagan"}
📞 <b>Telefon raqami:</b> ${user.phone || "Ko'rsatilmagan"}
📍 <b>Viloyat / Shahar:</b> ${user.region || "Sirdaryo"}
📅 <b>Vaqti:</b> ${tashkentTime} (Toshkent vaqti)
⭐ <b>Boshlang'ich ball:</b> ${user.points || 50} ball
🌐 <b>Manba:</b> faberlikxovos-gold.vercel.app

<i>Faberlic Ayollar & Qizlar Akademiyasi</i>`;

      if (adminId) {
        const sendResult = await sendTelegramMessage(adminId, messageText);
        return res.status(200).json({ ok: true, sentToAdmin: true, adminId, sendResult });
      } else {
        return res.status(200).json({ 
          ok: true, 
          sentToAdmin: false, 
          message: "Admin hali @Faberlicuz_bot ga /start yoki 080910 yozmagan." 
        });
      }
    }

    // B. Direct set admin chat id from website Admin Panel
    if (body.action === 'set_admin_chat_id' && body.chatId) {
      await setAdminChatId(body.chatId, body.name || 'Admin');
      await sendTelegramMessage(
        body.chatId,
        `✅ <b>Salom, Hurmatli Rahbar Nurangiz!</b>\n\nSiz @Faberlicuz_bot ga rasmiy <b>ADMIN</b> sifatida ulandingiz! Endi saytdan ro'yxatdan o'tganlar shu yerga keladi va o'quvchilar savollariga javob bera olasiz. 🌟`
      );
      return res.status(200).json({ ok: true, adminChatId: body.chatId });
    }

    // C. Telegram Update from Webhook (user writing to the bot)
    const update = body;
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = (msg.text || '').trim();
      const from = msg.from || {};
      const fullName = `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'Foydalanuvchi';
      const username = from.username ? `@${from.username}` : "yo'q";

      const currentAdminId = await getAdminChatId();

      // Check if this sender is registering as Admin (via passcode 080910)
      if (text === '080910' || text.startsWith('/admin 080910') || text === '/admin') {
        await setAdminChatId(chatId, fullName);
        await sendTelegramMessage(
          chatId,
          `👑 <b>TABRIKLAYMIZ, HURMATLI RAHBAR NURANGIZ!</b>\n\n` +
          `Siz <b>@Faberlicuz_bot</b> tizimiga <b>BOSH ADMIN</b> sifatida muvaffaqiyatli ulandingiz!\n\n` +
          `📌 <b>Sizning imkoniyatlaringiz:</b>\n` +
          `1️⃣ Saytda kim soat nechida, qachon va qaysi viloyatdan ro'yxatdan o'tsa, darhol shu yerga xabarnoma keladi.\n` +
          `2️⃣ O'quvchilar botga savol yozsa, sizga keladi. Siz o'sha xabarga shunchaki <b>"Reply" (Javob berish)</b> qilsangiz, sizning javobingiz to'g'ridan-to'g'ri o'quvchiga bot nomidan boradi!\n` +
          `3️⃣ Shuningdek: <code>/reply [ID] [Javobingiz]</code> buyrug'i orqali ham javob yozishingiz mumkin.\n\n` +
          `<i>Faberlic Ayollar & Qizlar Akademiyasi Boshqaruv Tizimi</i>`
        );
        return res.status(200).send('OK');
      }

      // Check if message is from the ADMIN
      if (String(chatId) === String(currentAdminId)) {
        // Did the admin reply to an existing forwarded question?
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
              await sendTelegramMessage(
                chatId,
                `✅ <b>Javobingiz o'quvchiga muvaffaqiyatli yetkazildi!</b>`
              );
            } else {
              await sendTelegramMessage(
                chatId,
                `⚠️ O'quvchiga javob yetkazishda xatolik yuz berdi: ${studentResult.description || 'Noma\'lum xato'}`
              );
            }
            return res.status(200).send('OK');
          }
        }

        // Did admin type /reply <id> <text>
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
        if (text === '/start') {
          await sendTelegramMessage(
            chatId,
            `👑 <b>Assalomu alaykum, Hurmatli Rahbar Nurangiz!</b>\n\n` +
            `Siz @Faberlicuz_bot ga <b>ADMIN</b> sifatida ulangansiz.\n` +
            `Hozirda barcha ro'yxatdan o'tishlar va o'quvchilar savollari sizga shu yerga kelmoqda. 🌸`
          );
          return res.status(200).send('OK');
        }
      }

      // MESSAGE FROM STUDENT / REGULAR USER:
      if (text === '/start') {
        await sendTelegramMessage(
          chatId,
          `Assalomu alaykum, <b>${fullName}</b>! 🌸\n\n` +
          `<b>Faberlic Ayollar va Qizlar Akademiyasi</b> rasmiy yordamchi botiga xush kelibsiz!\n\n` +
          `Agar darslar, biznes boshlash, ro'yxatdan o'tish yoki mahsulotlar bo'yicha savolingiz bo'lsa, xabaringizni shu yerga yozib qoldiring. Rahbariyatimiz sizga tez orada javob yozadilar! ✨\n\n` +
          `🌐 Rasmiy saytimiz: <a href="https://faberlikxovos-gold.vercel.app">faberlikxovos-gold.vercel.app</a>`
        );
        return res.status(200).send('OK');
      }

      // The student sent a question or message!
      const tashkentTime = new Date().toLocaleString('uz-UZ', { 
        timeZone: 'Asia/Tashkent',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      // 1. Reply to student
      await sendTelegramMessage(
        chatId,
        `Rahmat, <b>${fullName}</b>! Savolingiz Faberlic Akademiyasi rahbari Nurangiz Nurbeqqiziga yetkazildi. Tez orada javob olasiz! 🌸`
      );

      // 2. Forward/notify the Admin
      if (currentAdminId) {
        await sendTelegramMessage(
          currentAdminId,
          `📩 <b>YANGI O'QUVCHI SAVOLI!</b>\n\n` +
          `👤 <b>Kimdan:</b> ${fullName} (${username})\n` +
          `🆔 <b>ID:</b> #user_${chatId}\n` +
          `⏰ <b>Vaqti:</b> ${tashkentTime}\n\n` +
          `❓ <b>Savol / Murojaat:</b>\n` +
          `${text || '[Rasm yoki Fayl yuborildi]'}\n\n` +
          `-----------------------------------\n` +
          `👉 <b>Javob berish uchun:</b> Ushbu xabarga Telegramda <i>"Reply" (Javob berish)</i> qilib yozing yoki <code>/reply ${chatId} Javobingiz</code> formatida yozing!`
        );
      } else {
        console.warn('Student asked question, but Admin has not connected yet.');
      }

      return res.status(200).send('OK');
    }

    return res.status(200).send('OK');
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
