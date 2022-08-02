const { EmbedBuilder, Message, Client } = require('discord.js');
const Data = require('../../models/guild')

module.exports = {
    name: "prefix",
    category: "settings",
    description: "Change Prefix Bot In One Guild",
    args: true,
    usage: "<prefix>",
    aliases: ["setprefix"],
    userPerms: ["Administrator"],
    botPerms: [],
    owner: false,
    run: async (message, args, client, prefix) => {

        const data = Data.findOne({
            guildId: message.guildId,
        });
        let prefix2 = args[0];

        if (!args[0]) {
            const embed = new EmbedBuilder()
              .setDescription("Please give the prefix that you want to set!")
              .setColor("#d40d0d")
            return message.channel.send({ embeds: [embed] });
        }

        if (args[0].length > 3) {
            const embed = new EmbedBuilder()
              .setDescription("You can not set a prefix with more than 3 characters")
              .setColor("#d40d0d")
            return message.channel.send({ embeds: [embed] });
        }

        if (data) {
            let pre = await Data.findOneAndUpdate(
                {
                    guildId: message.guildId
                },
                {
                    prefix: args[0]
                }
            )
            const update = new EmbedBuilder()
              .setDescription(`Your prefix has been updated to **${args[0]}**`)
              .setColor("#05f7b3")
              .setTimestamp()
            return message.channel.send({ embeds: [update] });
        } else {
            const newData = await Data.create({
                guildId: message.guildId,
                prefix: args[0],
            });
            const embed = new EmbedBuilder()
            .setDescription(`Custom prefix in this server is now set to **${args[0]}**`)
            .setColor("#05f7b3")
            .setTimestamp()
            return message.channel.send({ embeds: [embed] });
        }
    }
}
