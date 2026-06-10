/**
 * Opium Fitness — приймач заявок з лендингу.
 * Записує заявку в Google Sheet і шле сповіщення в Telegram-групу менеджерів.
 *
 * НАЛАШТУВАННЯ (один раз):
 *  1. Створи Google-таблицю. Перший рядок (заголовки):
 *       Дата | Ім'я | Телефон | Напрямок | Коментар | Джерело | Сторінка
 *  2. У таблиці: Розширення → Apps Script. Встав цей код.
 *  3. Створи Telegram-бота через @BotFather → отримай TOKEN.
 *  4. Додай бота в групу менеджерів. Дізнайся CHAT_ID:
 *       - напиши щось у групі,
 *       - відкрий https://api.telegram.org/bot<TOKEN>/getUpdates
 *       - знайди "chat":{"id": -100XXXXXXXXXX} — це CHAT_ID (з мінусом).
 *  5. Заповни 3 константи нижче.
 *  6. Deploy → New deployment → type: Web app →
 *       Execute as: Me, Who has access: Anyone → Deploy.
 *  7. Скопіюй Web app URL і встав у index.html у константу LEAD_ENDPOINT.
 */

const TG_TOKEN = 'PASTE_TELEGRAM_BOT_TOKEN';
const TG_CHAT_ID = 'PASTE_TELEGRAM_CHAT_ID';   // напр. -1001234567890
const SHEET_NAME = '';                          // порожньо = активний аркуш

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendRow_(data);
    notifyTelegram_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function appendRow_(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getActiveSheet();
  sheet.appendRow([
    new Date(),
    d.name || '',
    d.phone || '',
    d.direction || '',
    d.message || '',
    d.source || '',
    d.page || ''
  ]);
}

function notifyTelegram_(d) {
  if (!TG_TOKEN || TG_TOKEN.indexOf('PASTE') === 0) return;
  const text =
    '🔥 *Нова заявка — Opium Fitness*\n\n' +
    '👤 *Ім’я:* ' + esc_(d.name) + '\n' +
    '📞 *Телефон:* ' + esc_(d.phone) + '\n' +
    (d.direction ? '🎯 *Напрямок:* ' + esc_(d.direction) + '\n' : '') +
    (d.message ? '💬 *Коментар:* ' + esc_(d.message) + '\n' : '') +
    '\n🌐 ' + esc_(d.source || 'direct');
  UrlFetchApp.fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    }),
    muteHttpExceptions: true
  });
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
