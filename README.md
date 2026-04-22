# 📩 ModMail Pro Series

<p align="center">

<img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" />
<img src="https://img.shields.io/badge/Database-SQLite-green?style=for-the-badge&logo=sqlite" />
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

</p>

<p align="center">

<a href="PUT_YOUR_DISCORD_INVITE_HERE">
<img src="https://img.shields.io/badge/Join%20Support%20Server-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"/>
</a>

<a href="https://github.com/your-username/modmail-pro-series">
<img src="https://img.shields.io/badge/View%20Project-GitHub-black?style=for-the-badge&logo=github"/>
</a>

</p>

---

# 🚀 Welcome to ModMail Pro Series

**ModMail Pro Series** is a collection of **professional-grade Discord ModMail bots** built using **discord.js v14**.

This repository provides **two powerful versions** designed for different server sizes and support needs.

---

# 📦 Choose Your Version

## 🟢 ModMail Lite (Memory Based)

**Best for:** Small servers or simple support systems.

### Features:

* ⚡ Lightweight (No Database Required)
* 🔧 Easy Setup
* 🔄 Session Recovery (Auto DM Scan)
* 📖 Clean & Beginner Friendly Code
* 🧠 Memory-Based Ticket System

---

## 🔵 ModMail Pro (Database Driven)

**Best for:** Large communities and professional teams.

### Features:

* 💾 SQLite Database Support
* 📩 Offline Message Recovery
* 🔁 Real-time Message Sync
* 🔒 Stable Ticket Management
* 🔄 Full Restart Persistence

---

# ✨ Core Features

Available in **both versions**:

* 🔁 **Bi-directional Communication**
  Chat seamlessly between **Users (DMs)** and **Staff Channels**

* 👤 **Manual Contact System**
  Staff can start tickets using:

!contact

* 🔐 **Permission Management**
  Ticket channels are automatically restricted to staff.

* 📎 **Attachment Support**
  Supports images and files.

* 🧹 **Clean Command System**

Includes:

!help
!close
!contact

---

# 🛠 Installation Guide

## Step 1 — Clone Repository

```bash
git clone https://github.com/your-username/modmail-pro-series.git
```

---

## Step 2 — Install Dependencies

### Lite Version:

```bash
npm install discord.js
```

### Pro Version:

```bash
npm install discord.js better-sqlite3
```

---

## Step 3 — Configuration

Open:

lite.js
or
pro.js

Fill the CONFIG object:

```js
const CONFIG = {
  TOKEN: 'YOUR_BOT_TOKEN',
  ADMIN_GUILD_ID: 'YOUR_SERVER_ID',
  CATEGORY_ID: 'YOUR_CATEGORY_ID',
  BOT_PREFIX: '!'
};
```

---

## Step 4 — Start the Bot

```bash
node index.js
```

---

# 📜 Commands Reference

| Command  | Usage    | Description              |
| -------- | -------- | ------------------------ |
| !help    | !help    | Shows available commands |
| !contact | !contact | Opens new support ticket |
| !close   | !close   | Closes active ticket     |
| !scan    | !scan    | Lite Version Only        |

---

# 🔗 Important Links

## 🌐 Support Server

Click below to join the official Discord support server:

👉 **PUT YOUR DISCORD LINK HERE**

Example:

👉 https://discord.gg/YOUR_INVITE

---

# 📌 ConnectLink-DM Integration

This project supports **ConnectLink-DM** system.

You can place your connection link here:

```text
# ConnectLink-DM
https://your-link-here.com
```

---

# 🛡 License

This project is licensed under the **MIT License**.

You are free to:

✔ Use
✔ Modify
✔ Distribute

---

# 💙 Credits

Created to enhance **Discord Community Support Systems**.

Built with ❤️ using:

* discord.js v14
* SQLite
* Node.js

---

# ⭐ Support The Project

If you like this project:

⭐ Star the repository
🔗 Share with others
💬 Join the Discord server

---
