const { CommandInteraction, Client, InteractionType, PermissionFlagsBits } = require("discord.js")
const prefixData = require('../models/guild');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const data = await prefixData.findOne({
            guildId: interaction.guildId
        });

        const prefix = data?.prefix ?? client.config.prefix;

        if (interaction.type === InteractionType.ApplicationCommand) {
            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;
            const player = interaction.client.manager.get(interaction.guildId);
            if (SlashCommands.player && !player) {
                if (interaction.replied) {
                    return await interaction.editReply({
                        content: `There is no player for this guild.`, ephemeral: true
                    }).catch(() => { });
                } else {
                    return await interaction.reply({
                        content: `There is no player for this guild.`, ephemeral: true
                    }).catch(() => { });
                }
            }
        }

        try {
            await SlashCommands.run(client, interaction, prefix);
        } catch (error) {
            if (interaction.replied) {
                await interaction.editReply({
                    content: `An unexcepted error occured.`
                }).catch(() => { });
            } else {
                await interaction.reply({
                    ephemeral: true,
                    content: `An unexcepted error occured.`
                }).catch(() => { });
            }
            console.error(error);
        };
    }
}

// Code By: WearTIme
// Constributor: Reyhan OP
