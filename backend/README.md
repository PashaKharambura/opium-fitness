# Заявки з лендингу → Telegram + Google Sheet

Форма на сайті відправляє заявку в Google Apps Script, який:
1. додає рядок у Google-таблицю (міні-CRM для менеджерів);
2. шле повідомлення в Telegram-групу менеджерів.

## Налаштування (≈10 хв, один раз)

1. **Google Sheet** — створи таблицю, перший рядок заголовків:
   `Дата | Ім'я | Телефон | Напрямок | Коментар | Джерело | Сторінка`

2. **Apps Script** — у таблиці: *Розширення → Apps Script*. Встав вміст
   `apps-script.gs`.

3. **Telegram-бот** — напиши [@BotFather](https://t.me/BotFather) → `/newbot`
   → отримай `TOKEN`. Додай бота у групу менеджерів.

4. **CHAT_ID групи** — напиши щось у групі, відкрий
   `https://api.telegram.org/bot<TOKEN>/getUpdates`, знайди
   `"chat":{"id":-100XXXXXXXXXX}` — це `CHAT_ID` (з мінусом).

5. Заповни у `apps-script.gs` константи `TG_TOKEN` і `TG_CHAT_ID`.

6. **Deploy** → *New deployment* → type **Web app** →
   *Execute as: Me*, *Who has access: Anyone* → **Deploy**.
   Скопіюй **Web app URL**.

7. У `index.html` встав цей URL у константу `LEAD_ENDPOINT`
   (пошук по файлу: `LEAD_ENDPOINT`).

8. Плаваюча кнопка Telegram у `index.html` (`class="float-chat"`) —
   заміни `https://t.me/+380930033636` на `@username` залу.

## Перевірка
Заповни форму на сайті → заявка має зʼявитись у таблиці і в Telegram-групі.

## Аналітика (потім)
У `index.html` функція `trackLead()` вже готова — коли підключиш
Firebase / GA4 / Meta Pixel, події `generate_lead` / `Lead`
полетять автоматично.
