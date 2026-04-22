# 🔗 ConnectLink-DM

<p align="center">

<img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" />
<img src="https://img.shields.io/badge/System-ModMail-purple?style=for-the-badge&logo=discord" />
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

</p>

<p align="center">

<a href="https://discord.gg/XXx8fttDNF">
<img src="https://img.shields.io/badge/Join%20Support%20Server-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"/>
</a>

<a href="https://github.com/Owline-an/ConnectLink-DM">
<img src="https://img.shields.io/badge/View%20Project-GitHub-black?style=for-the-badge&logo=github"/>
</a>

</p>

---

# 🚀 About ConnectLink-DM

**ConnectLink-DM** is a professional **Discord ModMail communication system** designed to simplify support communication between **users and staff**.

Built using **discord.js v14**, this system allows seamless messaging between user DMs and staff channels with a clean and scalable architecture.

---

# 📦 Available Versions

## 🟢 Lite Version (Memory Based)

**Best for:**
Small servers or lightweight support systems.

### Features:

* ⚡ Lightweight System
* 🧠 Memory-Based Tickets
* 🔄 Auto DM Session Recovery
* 📖 Beginner-Friendly Code
* ⚙️ Quick Setup

---

## 🔵 Pro Version (Database Driven)

**Best for:**
Large communities and professional support teams.

### Features:

* 💾 SQLite Database Support
* 📩 Offline Message Recovery
* 🔁 Message Sync (Edits & Deletes)
* 🔒 Persistent Ticket Storage
* 🔄 Safe Restart Recovery

---

# ✨ Core Features

These features are available in **all versions**:

* 🔁 **Bi-directional Communication**
  Users send messages via **DM**, staff reply from **server channels**.

* 👤 **Manual Contact System**

Start ticket manually:

```
!contact
```

* 🔐 **Permission Management**

Ticket channels are automatically restricted to admins.

* 📎 **Attachment Support**

Supports:

* Images

* Files

* Media Attachments

* 🧹 **Clean Command System**

Available commands:

```
!help
!contact
!close
!scan
```

---

# 🛠 Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Owline-an/ConnectLink-DM.git
```

---

## 2️⃣ Install Dependencies

### Lite Version:

```bash
npm install discord.js
```

### Pro Version:

```bash
npm install discord.js better-sqlite3
```

---

## 3️⃣ Configure Bot

Open:

```
lite.js
```

or

```
pro.js
```

Edit the CONFIG section:

```js
const CONFIG = {
  TOKEN: 'YOUR_BOT_TOKEN',
  ADMIN_GUILD_ID: 'YOUR_SERVER_ID',
  CATEGORY_ID: 'YOUR_CATEGORY_ID',
  BOT_PREFIX: '!'
};
```

---

## 4️⃣ Run The Bot

```bash
node index.js
```

---

# 📜 Commands Reference

| Command  | Description                    |
| -------- | ------------------------------ |
| !help    | Show command list              |
| !contact | Open support ticket            |
| !close   | Close active ticket            |
| !scan    | Scan lost sessions (Lite Only) |

---

# 🔗 Official Links

## 🌐 GitHub Repository

https://github.com/Owline-an/ConnectLink-DM

---

## 💬 Support Discord Server

Click to join:

👉 https://discord.gg/XXx8fttDNF

---

# 📌 ConnectLink-DM Integration

You can place external connection links here:

```
# ConnectLink-DM
https://your-connect-link-here.com
```

---

# 🛡 License

This project is licensed under the **MIT License**.

You are free to:

✔ Use
✔ Modify
✔ Distribute
✔ Improve

---

# 💙 Credits

Developed to enhance **Discord Support Systems**
and simplify communication between **Users** and **Staff**.

Built using:

* discord.js v14
* Node.js
* SQLite

---

# ⭐ Support The Project

If you like this project:

⭐ Star the repository
🔗 Share it with others
💬 Join the Discord server

Your support helps improve future updates 🚀

---
