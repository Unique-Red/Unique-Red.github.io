# Telegram Real-Time Job Alert Setup

This guide walks you through setting up real-time push alerts to your phone whenever new **KTP Associate** or **Global/UK Remote Backend** opportunities are discovered.

---

## Step 1: Create Your Free Telegram Bot (1 minute)

1. Open Telegram and search for `@BotFather` (verified bot with blue checkmark).
2. Send: `/newbot`
3. Follow the prompts:
   - Enter a display name (e.g. `Noah Job Radar`).
   - Enter a username ending in `bot` (e.g. `NoahJobRadar_bot`).
4. `@BotFather` will reply with your **HTTP API Token** (e.g. `7891234567:AAFnK_example_token_here`).
   - Copy this token. This is your `TELEGRAM_BOT_TOKEN`.

---

## Step 2: Get Your Personal Chat ID (30 seconds)

1. Start your new bot by opening the link provided by BotFather (or search your bot username in Telegram and tap **Start**).
2. Send any test message to your bot (e.g. `hello`).
3. Now search for `@userinfobot` in Telegram and send it `/start`.
4. `@userinfobot` will instantly reply with your numeric **Id** (e.g. `123456789`).
   - Copy this number. This is your `TELEGRAM_CHAT_ID`.

---

## Step 3: Add Secrets to GitHub (1 minute)

1. Open your GitHub repository in your browser:
   `https://github.com/Unique-Red/Unique-Red.github.io`
2. Click **Settings** (top tabs) ➔ **Secrets and variables** (left sidebar) ➔ **Actions**.
3. Under **Repository secrets**, click **New repository secret**:
   - **Secret 1**:
     - Name: `TELEGRAM_BOT_TOKEN`
     - Value: *(Paste your bot token from Step 1)*
   - **Secret 2**:
     - Name: `TELEGRAM_CHAT_ID`
     - Value: *(Paste your numeric ID from Step 2)*

---

## Step 4: Testing & Running

- **In GitHub**: Go to **Actions** ➔ Click **Automated KTP & Job Radar Crawler** ➔ Click **Run workflow**.
- **On Your Computer**: In PowerShell, you can test anytime:
  ```powershell
  $env:TELEGRAM_BOT_TOKEN="your_bot_token"
  $env:TELEGRAM_CHAT_ID="your_chat_id"
  python scripts/job_crawler.py
  ```
Whenever new roles match your profile (KTP Associate openings, UK/Global remote roles), your phone will buzz with direct deep links!
