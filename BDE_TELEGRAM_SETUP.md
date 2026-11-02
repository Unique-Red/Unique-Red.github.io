# Tinuijioluwa Oduniyi — BDE Telegram Bot Setup Guide

This guide walks you through setting up a separate Telegram Bot to receive real-time alerts whenever new **Business Development Executive, Partnerships, or B2B Sales** opportunities are detected.

---

### Step 1: Create the Telegram Bot (1 minute)
1. Open Telegram on your phone or desktop and search for **[@BotFather](https://t.me/BotFather)** (official verified account with blue checkmark).
2. Click **Start** or send `/start`.
3. Send `/newbot`.
4. Choose a friendly name for your bot, e.g.:
   ```text
   Tinu BDE Career Radar
   ```
5. Choose a unique username ending in `bot`, e.g.:
   ```text
   tinu_bde_radar_bot
   ```
6. BotFather will reply with your **Bot Token** (looks like `7123456789:ABCdefGHIjklMNOpqrsTUVwxyz123456`). **Save this token.**

---

### Step 2: Get Your Chat ID (30 seconds)
1. In Telegram, search for **[@userinfobot](https://t.me/userinfobot)**.
2. Click **Start** or send `/start`.
3. The bot will instantly reply with your account details, including your **Id** (a 9-10 digit number, e.g., `123456789`). **Save this number.**
4. Now open your new bot (e.g. `@tinu_bde_radar_bot`) and click **Start** or send `/start` so the bot is allowed to send you messages.

---

### Step 3: Add Secrets to GitHub (For Automated Daily Alerts)
1. Go to your GitHub repository: `https://github.com/Unique-Red/Unique-Red.github.io`
2. Click **Settings** (top navigation tab) &rarr; **Secrets and variables** (left sidebar) &rarr; **Actions**.
3. Under **Repository secrets**, click **New repository secret**:
   - **Secret 1**:
     - Name: `TELEGRAM_BOT_TOKEN_BDE`
     - Secret: *(Paste the Bot Token from Step 1)*
   - **Secret 2**:
     - Name: `TELEGRAM_CHAT_ID_BDE`
     - Secret: *(Paste the numeric Chat ID from Step 2)*
4. Click **Add secret**.

---

### Step 4: Test Your Bot (Optional / Local)
If you want to test the connection immediately on your computer:
1. Add the credentials to your local `.env` file:
   ```env
   TELEGRAM_BOT_TOKEN_BDE=7123456789:ABCdefGHIjklMNOpqrsTUVwxyz123456
   TELEGRAM_CHAT_ID_BDE=123456789
   ```
2. Run the test command in PowerShell/Terminal:
   ```bash
   python scripts/bde_job_crawler.py --test-alert
   ```
3. Check your Telegram—you will receive a verified connection alert!

---

### Your Private Dashboard URL
Your private, unindexed BDE radar dashboard will be live at:
👉 **`https://unique-red.github.io/bizdev-radar.html`**
