ModMail Pro (Database Edition) 📩

ModMail Pro is an advanced Discord ModMail bot built with discord.js v14. Unlike simple versions, this edition utilizes a SQLite Database to ensure absolute synchronization and reliability for support teams.

✨ Key Features

Persistent Sessions: All tickets are stored in database.sqlite. If the bot restarts, it remembers every open ticket.

Downtime Recovery: When the bot goes online, it automatically scans for messages sent while it was offline and delivers them to the staff channels.

Bi-directional Message Sync:

Edits: If a user edits a DM, the message in the staff channel updates automatically.

Deletes: If a staff member or user deletes a message, it is deleted on both ends.

Staff Tools: Easy-to-use commands for contacting users via ID and closing tickets.

Privacy Protected: Staff channels are automatically restricted to admins/staff using category permission overwrites.

🚀 Getting Started

Prerequisites

Node.js v16.9.0 or higher.

The better-sqlite3 and discord.js packages.

Installation

Clone the repository:

git clone [https://github.com/your-username/modmail-pro.git](https://github.com/your-username/modmail-pro.git)


Install dependencies:

npm install discord.js better-sqlite3


Configuration (index.js):

TOKEN: Your bot token.

ADMIN_GUILD_ID: Your staff server ID.

CATEGORY_ID: The category ID where tickets will be generated.

Running the Bot

node index.js


🛠 Commands

!help: Shows the available commands.

!contact <UserID>: Initiates a conversation with a user.

!close: Closes the ticket and clears it from the database.

📝 License

This project is licensed under the MIT License.

Created with ❤️ by [Your Name]