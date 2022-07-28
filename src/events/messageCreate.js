const { EmbedBuilder, Message, Client, PermissionsBitField, inlineCode } = require('discord.js');
const prefixData = require('../models/guild');

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    execute: async (client, message) => {
        if (message.author.bot || message.system || message.webhookId) return;

        if (!message.guild.members.me.permissions.has('SendMessages') || !message.guild.members.me.permissionsIn(message.channel).has('SendMessages')) {
            return;
        }

        // prefix
        const data = await prefixData.findOne({
            guildId: message.guildId
        });

        const prefix = data?.prefix ?? client.config.prefix;

        // Reg EXP tag
        const regEx = new RegExp(`^<@!?${client.user.id}>$`);
        if (regEx.test(message.content)) {
            message.channel.send(`Hello, My Prefix in This Server is ${inlineCode(prefix)}, My Author Is WearTime`)
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('SendMessages'))) return await message.author.dmChannel.send({ content: `I don't have ${inlineCode(`SEND_MESSAGES`)} permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });
        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('ViewChannel'))) return;
        if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve('EmbedLinks'))) return await message.channel.send({ content: `I don't have ${inlineCode(`EMBED_LINKS`)} permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });
        
        const errorEmbed = new EmbedBuilder()
            .setColor('#d40d0d')
        
        const successEmbed = new EmbedBuilder()
            .setColor('#d40d0d')

        if (command.args && !args.length) {

            if (command.usage) {
                let embed = `You didn't provide any arguments, ${message.author}!\nUsage: \`${prefix}${command.name} ${command.usage}\``;
                errorEmbed.setDescription(embed)
            }

            return message.channel.send({ embeds: [errorEmbed] });
        }

        if (command.botPerms) {
            if(!message.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                errorEmbed.setDescription(`I don't have **\`${command.permission}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`)
                return message.channel.send({ embeds: [errorEmbed] })
            }
        }

        if (command.userPerms) {
            if(!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                errorEmbed.setDescription(`You don't have **\`${command.userPerms}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`)
                return message.channel.send({ embeds: [errorEmbed] })
            }
        }

        if (command.ownerOnly && message.author.id !== `${client.owner}`) {
            errorEmbed.setDescription(`Only <@${client.owner}> can use this command`)
            return message.channel.send({ embeds: [errorEmbed] })
        }

        try {
            command.run(message, args, client, prefix);
        } catch (err) {
            client.consoleColor.error(err)
            errorEmbed.setDescription(`There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately.`)
            return message.channel.send({ embeds: [errorEmbed] })
        }
    }
}
