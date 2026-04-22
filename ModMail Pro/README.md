ModMail Pro 📩

ModMail Pro is a clean, modern, and human-readable Discord bot built with discord.js v14. It allows users to contact server staff via Direct Messages, creating organized ticket channels within a dedicated staff server.

✨ Features

DM to Ticket: Automatically creates a text channel in your staff server when a user DMs the bot.

Bi-directional Communication: Staff can reply directly in the ticket channel, and the message is sent back to the user.

Attachment Support: Handles images and files seamlessly.

Session Recovery: A !scan command to recover or find active conversations from the bot's memory.

Permission Friendly: Automatically hides ticket channels from unauthorized users using category permissions.

🚀 Getting Started

Prerequisites

Node.js v16.9.0 or higher.

A Discord Bot Token (via Discord Developer Portal).

Installation

Clone this repository:

git clone [https://github.com/your-username/modmail-pro.git](https://github.com/your-username/modmail-pro.git)


Install dependencies:

npm install discord.js


Update index.js with your configuration:

TOKEN: Your Bot Token.

ADMIN_GUILD_ID: The ID of your staff/admin server.

CATEGORY_ID: The ID of the category where tickets should be created.

Running the Bot

node index.js


🛠 Commands

!contact <UserID>: Manually open a ticket with a specific user.

!close: Deletes the current ticket channel.

!scan: Scans the bot's current cache to find and rebuild missing ticket channels for active DMs.

📝 License

This project is licensed under the MIT License. Feel free to use and modify it!

Created with ❤️ by [Your Name]