require('dotenv').config({path:'../../.env'});

module.exports = {
    getServerHook(emitter, discordBot) {
        emitter.on('server:logging', (message) => {
            discordBot.log(message);
        })
    }
};
