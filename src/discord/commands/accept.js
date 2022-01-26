const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("accept")
        .setDescription(
            "bla bla"
        )
        .addUserOption((option) => {
            return option
                .setName("target")
                .setDescription("The user to accepted");
        }),
    mod: true,
    async execute(client, interaction) {
        const user = interaction.options.getUser("target");
        if (user) {
            const role = client.guilds.cache.get("696537024143818773").roles.cache.find(r => r.name === ".");
            user.roles.remove(role);
            return interaction.reply({
                content: 'Thanks for submitting your GitHub username, ' + user.username, 
            });
        }
        return interaction.reply({
            content: `Please specify a user to accept`, 
            ephemeral: true
        });
    },
};
