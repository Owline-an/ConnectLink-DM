const { 
    Client, 
    GatewayIntentBits, 
    ChannelType, 
    PermissionsBitField, 
    EmbedBuilder,
    Events,
    Partials
} = require('discord.js');
const Database = require('better-sqlite3');

// --- Database Configuration ---
const db = new Database('database.sqlite');

function initializeDatabase() {
    // Table for active tickets
    db.prepare(`
        CREATE TABLE IF NOT EXISTS tickets (
            channelId TEXT PRIMARY KEY, 
            userId TEXT, 
            lastMessageId TEXT
        )
    `).run();
    
    // Table for mapping messages (Syncing edits and deletes)
    db.prepare(`
        CREATE TABLE IF NOT EXISTS message_map (
            dmMessageId TEXT, 
            channelMessageId TEXT
        )
    `).run();

    // Ensure lastMessageId column exists for backward compatibility
    const tableInfo = db.prepare("PRAGMA table_info(tickets)").all();
    if (!tableInfo.some(column => column.name === 'lastMessageId')) {
        db.prepare('ALTER TABLE tickets ADD COLUMN lastMessageId TEXT').run();
    }
}

initializeDatabase();

// --- Client Configuration ---
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel, Partials.Message] 
});

const CONFIG = {
    TOKEN: 'YOUR_BOT_TOKEN_HERE', // It's better to use process.env.TOKEN
    ADMIN_GUILD_ID: '925338827822866513',
    CATEGORY_ID: '1496247365579968663',
    BOT_PREFIX: '!'
};

// --- Helper Functions ---

/**
 * Creates or fetches a ticket channel for a specific user
 */
async function getOrCreateTicketChannel(user, lastMsgId) {
    const adminGuild = client.guilds.cache.get(CONFIG.ADMIN_GUILD_ID);
    if (!adminGuild) return null;

    const row = db.prepare('SELECT channelId FROM tickets WHERE userId = ?').get(user.id);
    let targetChannel = row ? adminGuild.channels.cache.get(row.channelId) : null;

    if (!targetChannel) {
        targetChannel = await adminGuild.channels.create({
            name: `ticket-${user.username}`,
            type: ChannelType.GuildText,
            parent: CONFIG.CATEGORY_ID,
            permissionOverwrites: [
                { 
                    id: adminGuild.id, 
                    deny: [PermissionsBitField.Flags.ViewChannel] 
                }
            ],
        });

        db.prepare('INSERT OR REPLACE INTO tickets (channelId, userId, lastMessageId) VALUES (?, ?, ?)')
          .run(targetChannel.id, user.id, lastMsgId);
        
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('New Ticket Created')
            .setDescription(`Successfully created a communication channel for **${user.tag}** (${user.id}).`)
            .setTimestamp();

        await targetChannel.send({ embeds: [welcomeEmbed] });
    }
    return targetChannel;
}

/**
 * Checks for messages sent while the bot was offline
 */
async function checkMissedMessages() {
    console.log('Checking for missed messages during downtime...');
    
    const activeTickets = db.prepare('SELECT * FROM tickets').all();
    
    for (const ticket of activeTickets) {
        try {
            const user = await client.users.fetch(ticket.userId).catch(() => null);
            if (!user) continue;

            const dmChannel = await user.createDM();
            const adminGuild = client.guilds.cache.get(CONFIG.ADMIN_GUILD_ID);
            const targetChannel = adminGuild.channels.cache.get(ticket.channelId);

            if (!targetChannel) continue;

            const messages = await dmChannel.messages.fetch({ after: ticket.lastMessageId || '0' });
            
            if (messages.size > 0) {
                for (const [id, msg] of messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp)) {
                    if (msg.author.bot) continue;
                    
                    await targetChannel.send({
                        content: `⚠️ **[Missed Message - Sent while offline]:**\n${msg.content}`,
                        files: msg.attachments.map(a => a.url)
                    });

                    db.prepare('UPDATE tickets SET lastMessageId = ? WHERE userId = ?').run(msg.id, ticket.userId);
                }
            }
        } catch (error) {
            console.error(`Error syncing messages for user ${ticket.userId}:`, error.message);
        }
    }
    console.log('Missed messages sync completed.');
}

// --- Event Listeners ---

client.once('ready', async () => {
    console.log(`Logged in as: ${client.user.tag}`);
    await checkMissedMessages();
});

// Sync Edits
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (newMessage.author.bot || oldMessage.content === newMessage.content) return;

    if (newMessage.channel.type === ChannelType.DM) {
        const link = db.prepare('SELECT channelMessageId FROM message_map WHERE dmMessageId = ?').get(oldMessage.id);
        if (link) {
            const ticket = db.prepare('SELECT channelId FROM tickets WHERE userId = ?').get(newMessage.author.id);
            const channel = client.channels.cache.get(ticket?.channelId);
            const msgToEdit = await channel?.messages.fetch(link.channelMessageId).catch(() => null);
            if (msgToEdit) await msgToEdit.edit(`**[Edited] [${newMessage.author.username}]:** ${newMessage.content}`);
        }
    } else {
        const link = db.prepare('SELECT dmMessageId FROM message_map WHERE channelMessageId = ?').get(oldMessage.id);
        if (link) {
            const ticket = db.prepare('SELECT userId FROM tickets WHERE channelId = ?').get(newMessage.channel.id);
            const user = await client.users.fetch(ticket?.userId).catch(() => null);
            const msgToEdit = await user?.dmChannel?.messages.fetch(link.dmMessageId).catch(() => null);
            if (msgToEdit) await msgToEdit.edit(newMessage.content);
        }
    }
});

// Sync Deletions
client.on(Events.MessageDelete, async (message) => {
    // If message deleted in DM
    const linkDM = db.prepare('SELECT channelMessageId FROM message_map WHERE dmMessageId = ?').get(message.id);
    if (linkDM) {
        const ticket = db.prepare('SELECT channelId FROM tickets WHERE userId = ?').get(message.author?.id);
        const channel = client.channels.cache.get(ticket?.channelId);
        const msgDel = await channel?.messages.fetch(linkDM.channelMessageId).catch(() => null);
        if (msgDel) await msgDel.delete();
        db.prepare('DELETE FROM message_map WHERE dmMessageId = ?').run(message.id);
    }

    // If message deleted in Staff Channel
    const linkChan = db.prepare('SELECT dmMessageId FROM message_map WHERE channelMessageId = ?').get(message.id);
    if (linkChan) {
        const ticket = db.prepare('SELECT userId FROM tickets WHERE channelId = ?').get(message.channel.id);
        const user = await client.users.fetch(ticket?.userId).catch(() => null);
        const msgDel = await user?.dmChannel?.messages.fetch(linkChan.dmMessageId).catch(() => null);
        if (msgDel) await msgDel.delete();
        db.prepare('DELETE FROM message_map WHERE channelMessageId = ?').run(message.id);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // --- Command: Help ---
    if (message.content === `${CONFIG.BOT_PREFIX}help`) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('Modmail Commands')
            .addFields(
                { name: `${CONFIG.BOT_PREFIX}help`, value: 'Displays this help menu.' },
                { name: `${CONFIG.BOT_PREFIX}contact [User ID]`, value: 'Manually open a ticket with a user.' },
                { name: `${CONFIG.BOT_PREFIX}close`, value: 'Closes the current ticket and deletes the channel.' }
            )
            .setFooter({ text: 'Modmail Support System' });
        return message.reply({ embeds: [helpEmbed] });
    }

    // --- DM Handling (User to Staff) ---
    if (message.channel.type === ChannelType.DM) {
        const targetChannel = await getOrCreateTicketChannel(message.author, message.id);
        
        if (targetChannel) {
            db.prepare('UPDATE tickets SET lastMessageId = ? WHERE userId = ?').run(message.id, message.author.id);
            
            const sent = await targetChannel.send({
                content: `**[${message.author.username}]:** ${message.content}`,
                files: message.attachments.map(a => a.url)
            });
            
            db.prepare('INSERT INTO message_map (dmMessageId, channelMessageId) VALUES (?, ?)').run(message.id, sent.id);
            await message.react('✅');
        }
    }

    // --- Staff Channel Handling (Staff to User) ---
    const ticket = db.prepare('SELECT userId FROM tickets WHERE channelId = ?').get(message.channel.id);
    
    if (message.guildId === CONFIG.ADMIN_GUILD_ID && ticket) {
        // Command: Close
        if (message.content.startsWith(`${CONFIG.BOT_PREFIX}close`)) {
            db.prepare('DELETE FROM tickets WHERE channelId = ?').run(message.channel.id);
            return message.channel.delete();
        }

        const user = await client.users.fetch(ticket.userId).catch(() => null);
        if (user) {
            try {
                const sent = await user.send({
                    content: message.content,
                    files: message.attachments.map(a => a.url)
                });
                db.prepare('INSERT INTO message_map (dmMessageId, channelMessageId) VALUES (?, ?)').run(sent.id, message.id);
                await message.react('✉️');
            } catch (err) {
                await message.reply("❌ **Error:** Could not send message. The user might have DMs disabled.");
            }
        }
    }

    // --- Command: Contact (Manual Open) ---
    if (message.content.startsWith(`${CONFIG.BOT_PREFIX}contact`)) {
        const args = message.content.split(' ');
        const userId = args[1];
        if (!userId) return message.reply("Please provide a valid User ID.");

        try {
            const user = await client.users.fetch(userId);
            const targetChannel = await getOrCreateTicketChannel(user, '0');
            await message.reply(`Ticket opened: <#${targetChannel.id}>`);
        } catch (err) {
            message.reply("User not found or ID is invalid.");
        }
    }
});

client.login(CONFIG.TOKEN);