module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.isButton()) {
            if(interaction.customId == "yesGitHubAccount") {
                const logChannel = client.channels.cache.get("883854861278535710");
                const githubUsername = interaction.message.content.split('https://github.com/')[1];
                logChannel.send(
                    '<@' + interaction.user.id + '>: http://github.com/' + githubUsername + '\n\n' +
                    'To accept: ?role ' + interaction.user.id + ' -@.'
                );
                return interaction.update({
                    content: 'Thanks for submitting your GitHub username, <@' + interaction.user.id + '>', 
                    components: [],
                    ephemeral: true
                });
            }
            if(interaction.customId == "noGitHubAccount") {
                return interaction.update({
                    content: 'Please try again, <@' + interaction.user.id + '>', 
                    components: [],
                    ephemeral: true
                });
            }
            return
        }
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            if(command.mod && !interaction.member.roles.cache.has("762841244949807114")) {
                return interaction.reply({
                    content: 'You need the `Moderator` role to use this command.', 
                    ephemeral: true
                });
            }
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
