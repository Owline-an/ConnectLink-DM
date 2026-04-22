/**
 * ModMail Pro - A simple and efficient Discord ModMail Bot
 * Built with discord.js v14
 */

const { 
    Client, 
    GatewayIntentBits, 
    ChannelType, 
    PermissionsBitField, 
    EmbedBuilder,
    Partials
} = require('discord.js');

// Initialize the Discord Client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User] 
});

// --- Configuration Object ---
const CONFIG = {
    TOKEN: 'YOUR_BOT_TOKEN_HERE',
    ADMIN_GUILD_ID: '925338827822866513', // Staff Server ID
    CATEGORY_ID: '1496247365579968663',    // Category where tickets will be created
    BOT_PREFIX: '!' 
};

/**
 * Helper function to parse and format message attachments
 * @param {Message} message 
 * @returns {string} Formatted attachment string
 */
function formatAttachments(message) {
    if (!message.attachments || message.attachments.size === 0) return "";
    
    let attachmentText = "\n📎 **Attachments:**\n";
    message.attachments.forEach(att => {
        attachmentText += `• [${att.name || 'File'}](${att.url})\n`;
    });
    return attachmentText;
}

/**
 * Ensures a support channel exists for a specific user
 * @param {User} user 
 * @param {Guild} adminGuild 
 * @returns {Object} { channel, created, error }
 */
async function getOrCreateUserChannel(user, adminGuild) {
    await adminGuild.channels.fetch();
    
    // Find existing channel by topic (contains User ID)
    let targetChannel = adminGuild.channels.cache.find(c => 
        c.parentId === CONFIG.CATEGORY_ID && 
        (c.topic === `User ID: ${user.id}` || c.topic?.includes(user.id))
    );

    if (!targetChannel) {
        try {
            targetChannel = await adminGuild.channels.create({
                name: `ticket-${user.username}`,
                type: ChannelType.GuildText,
                parent: CONFIG.CATEGORY_ID,
                topic: `User ID: ${user.id}`,
                permissionOverwrites: [
                    {
                        id: adminGuild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }
                ]
            });

            const welcomeEmbed = new EmbedBuilder()
                .setColor('#2ecc71')
                .setTitle('📩 New ModMail Ticket')
                .setDescription(`**User:** <@${user.id}>\n**ID:** ${user.id}\n\nThis channel was created to handle the conversation with this user.`)
                .setTimestamp()
                .setFooter({ text: 'ModMail Pro System' });

            await targetChannel.send({ embeds: [welcomeEmbed] });
            return { channel: targetChannel, created: true };
        } catch (err) {
            console.error(`[Error] Could not create channel for ${user.id}:`, err);
            return { error: true };
        }
    }
    return { channel: targetChannel, created: false };
}

/**
 * Scans active DM cache to recover lost sessions
 * @param {TextChannel} feedbackChannel 
 */
async function scanActiveDMs(feedbackChannel) {
    const adminGuild = client.guilds.cache.get(CONFIG.ADMIN_GUILD_ID);
    if (!adminGuild) return feedbackChannel.send("❌ Error: Admin Server not found.");

    await feedbackChannel.send("🔍 Scanning memory for active conversations... please wait.");
    
    let createdCount = 0;
    
    try {
        const dmChannels = client.channels.cache.filter(c => c.type === ChannelType.DM);
        
        if (dmChannels.size === 0) {
            return feedbackChannel.send("⚠️ No active DM sessions found in cache.");
        }

        for (const [id, dmChannel] of dmChannels) {
            let recipient = dmChannel.recipient;
            if (!recipient) {
                try {
                    const fetchedChannel = await client.channels.fetch(id);
                    recipient = fetchedChannel.recipient;
                } catch (e) { continue; }
            }

            if (!recipient || recipient.bot) continue;

            const result = await getOrCreateUserChannel(recipient, adminGuild);
            if (result.created) createdCount++;
        }

        await feedbackChannel.send(`✅ Scan complete. Created **${createdCount}** new support channels.`);
    } catch (error) {
        console.error("[Error] Scan failed:", error);
        await feedbackChannel.send("❌ An unexpected error occurred during the scan.");
    }
}

// --- Event Handlers ---

client.once('ready', () => {
    console.log(`🚀 ModMail Pro is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const adminGuild = client.guilds.cache.get(CONFIG.ADMIN_GUILD_ID);

    // 1. Admin Commands (Prefix based)
    if (message.guildId === CONFIG.ADMIN_GUILD_ID && message.content.startsWith(CONFIG.BOT_PREFIX)) {
        const args = message.content.slice(CONFIG.BOT_PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'scan') {
            return await scanActiveDMs(message.channel);
        }

        if (command === 'contact') {
            const userId = args[0];
            if (!userId) return message.reply("Please provide a User ID.");
            
            const user = await client.users.fetch(userId).catch(() => null);
            if (!user) return message.reply("User not found.");
            
            const result = await getOrCreateUserChannel(user, adminGuild);
            if (result.created) return message.reply(`✅ Ticket opened: <#${result.channel.id}>`);
            else return message.reply(`⚠️ Ticket already exists: <#${result.channel.id}>`);
        }

        if (command === 'close' && message.channel.topic?.includes('User ID: ')) {
            return message.channel.delete().catch(console.error);
        }
    }

    // 2. Handling Incoming DMs (User to Staff)
    if (message.channel.type === ChannelType.DM) {
        if (!adminGuild) return;

        const result = await getOrCreateUserChannel(message.author, adminGuild);
        const targetChannel = result.channel;

        if (targetChannel) {
            let logContent = `**[${message.author.username}]:** ${message.content || "*[No Text]*"}`;
            const attachments = formatAttachments(message);
            if (attachments) logContent += attachments;
            
            await targetChannel.send(logContent).catch(console.error);
        }
    }

    // 3. Handling Outgoing Replies (Staff to User)
    if (message.guildId === CONFIG.ADMIN_GUILD_ID && message.channel.topic?.includes('User ID: ')) {
        // Skip commands in the support channel
        if (message.content.startsWith(CONFIG.BOT_PREFIX)) return;

        const topic = message.channel.topic;
        const userIdMatch = topic.match(/\d{17,19}/); 
        if (!userIdMatch) return;

        const userId = userIdMatch[0];
        const user = await client.users.fetch(userId).catch(() => null);

        if (user) {
            try {
                let replyBody = message.content;
                const attachments = formatAttachments(message);
                if (attachments) replyBody += attachments;

                await user.send(replyBody);
                await message.react('✅');
            } catch (err) {
                await message.reply("❌ **Failed to send DM:** User might have closed their DMs.");
            }
        }
    }
});

client.login(CONFIG.TOKEN);