const { EmbedBuilder, CommandInteraction, Client, ApplicationCommandType } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Return websocket ping",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        interaction.reply({ content: `🏓 Pong! Latency: **${Math.round(client.ws.ping)} ms**` })
    }
}
