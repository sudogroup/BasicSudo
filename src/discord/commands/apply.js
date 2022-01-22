const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("apply")
        .setDescription(
            "Apply to be part of the community."
        )
        .addStringOption((option) => {
            return option
                .setName("github_username")
                .setDescription("Enter your github username (e.g. sudomaze)");
        }),
    async execute(client, interaction) {
        const githubUsername = interaction.options.getString("github_username");
        const logChannel = client.channels.cache.get("883854861278535710");
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('yesGitHubAccount')
					.setLabel(`Yes`)
					.setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('noGitHubAccount')
                    .setLabel('No')
                    .setStyle('DANGER'),
        );
        
        return interaction.reply({ 
            content: 'Is this your github account? https://github.com/' + githubUsername, 
            ephemeral: true, 
            components: [row] 
        });
    },
};
