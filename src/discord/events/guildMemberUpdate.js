const { MessageEmbed } = require('discord.js');

function removeElementsNotIn(a, b) {
    return a.filter(function(item) { 
       return b.indexOf(item) < 0; // Returns true for items not found in b.
    });
}
// '883806131120664619' == '.' role
// '883782996904247326' == 'Active' role (for testing)
const TARGETED_ROLE = '883806131120664619'
module.exports = {
    name: "guildMemberUpdate",
    async execute(client, oldMember, newMember) {
        const   oldMemberRoles = oldMember.roles.cache.map(r => r.id),
                newMemberRoles = newMember.roles.cache.map(r => r.id);
        console.log(oldMemberRoles.length, newMemberRoles.length);
        if (oldMemberRoles.length > newMemberRoles.length) {
            const roleRemoved = removeElementsNotIn(oldMemberRoles, newMemberRoles)[0];
            if (roleRemoved == TARGETED_ROLE) {
                const logChannel = client.channels.cache.get("842646423748214805");
                const welcomeEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`You have been **accepted** into the Sudo Group\'s community!`)
                    .setDescription('Check the following channels:')
                    .addFields(
                        { name: '#introduce-yourrself', value: 'Let everyone know you more!' },
                        { name: '#self-roles', value: 'Pick the badges that describe your interests!' },
                        { name: '#idea', value: 'Suggest ideas for the community.' },
                        { name: '#job-postings', value: 'Are you looking for a job or would like to post a job description? Check the channel!' },
                    )
                oldMember.user.send({ embeds: [welcomeEmbed] })
                logChannel.send(
                    'Accepted: <@' + newMember.id + '>'
                );
            } 
        }
        else {
            const roleAdded = removeElementsNotIn(newMemberRoles, oldMemberRoles);
            if (roleAdded == TARGETED_ROLE) {
                const logChannel = client.channels.cache.get("842646423748214805");
                const welcomeEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Welcome to Sudo Group\'s community!`)
                    .setDescription('Please complete your application to join the community by doing the following:')
                    .addFields(
                        { name: '1) Access \`#apply\` channel.', value: '\u200B' },
                        { name: '2) Type \`\apply\`.', value: '\u200B' },
                        { name: '3) Select \`github_username\` and enter your GitHub account.', value: '\u200B' },
                        { name: '4) Verify your GitHub account.', value: '\u200B' },
                        { name: '5) Please read \`#readme\` for more information.', value: '\u200B' },
                    )
                oldMember.user.send({ embeds: [welcomeEmbed] })
                logChannel.send(
                    'Welcomed: <@' + newMember.id + '>'
                );
            } 
        }
    },
};
