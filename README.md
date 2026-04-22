ModMail Pro Series 📩

Welcome to the ModMail Pro Series – a collection of professional-grade Discord ModMail bots built with discord.js v14. This repository offers two distinct versions tailored to different community needs.

🚀 Choose Your Version

1. ModMail Lite (Memory Based)

Best for: Small servers or simple support needs.

Lightweight: No external database required.

Easy Setup: Just plug in your token and IDs.

Session Recovery: Scans active DMs to recover lost staff channels.

Human-Readable: Clean and commented code for beginners.

2. ModMail Pro (Database Driven)

Best for: Large communities and professional support teams.

SQLite Persistence: Uses better-sqlite3 to store ticket data permanently.

Offline Recovery: Automatically delivers messages sent by users while the bot was offline.

Real-time Sync: Synchronizes message Edits and Deletions between DMs and Staff Channels.

Stability: Maintains ticket links even after a full bot restart.

✨ Features Across Both Versions

Bi-directional Communication: Seamless chat between users (via DMs) and staff (via Server Channels).

Manual Contact: Staff can initiate a ticket using !contact <UserID>.

Permission Friendly: Automatically restricts ticket channels to admins using Category Overwrites.

Attachment Support: Handles images and files shared in the conversation.

Clean Command System: Includes !help, !close, and !contact.

🛠 Installation & Setup

Clone the repository:

git clone [https://github.com/your-username/modmail-pro-series.git](https://github.com/your-username/modmail-pro-series.git)


Install dependencies:
For Lite Version:

npm install discord.js


For Pro Version:

npm install discord.js better-sqlite3


Configuration:
Open the version you wish to use (lite.js or pro.js) and fill in the CONFIG object:

const CONFIG = {
    TOKEN: 'YOUR_BOT_TOKEN',
    ADMIN_GUILD_ID: 'YOUR_SERVER_ID',
    CATEGORY_ID: 'YOUR_CATEGORY_ID',
    BOT_PREFIX: '!'
};


Launch the bot:

node index.js


🛠 Commands Reference

Command

Usage

Description

!help

!help

Displays the available commands.

!contact

!contact <UserID>

Opens a new support channel for a specific user.

!close

!close

Closes the active ticket and clears data/channels.

!scan

!scan

(Lite only) Scans memory for lost active DMs.

🛡 License

This project is licensed under the MIT License. You are free to use, modify, and distribute it.

Created with ❤️ to enhance Discord Community Support."# ConnectLink-DM" 
