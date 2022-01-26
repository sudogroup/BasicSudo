require('dotenv').config({path:'../.env'});

const express = require('express'),
    fs = require('fs'),
    http = require('http'),
    cron = require('node-cron'),
    { EventEmitter } = require("events"),
    { Server } = require("socket.io");
const { postRequest } = require('./api/server');
const { getStreams } = require('./api/twitch');

const {DiscordBot} = require('./DiscordBot'),
    {getServerHook} = require('./hooks/server'),
    {getSocketHook} = require('./hooks/socket');

const app = express(),
    server = http.createServer(app),
    io = new Server(server),
    port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.raw({ type: 'application/json' })); // Need raw message body for signature verification
app.use(express.static(__dirname + '/server/public')); //Serves resources from public folder
app.set('views', __dirname+'/server/views/'); // fix issue with subdirectory
app.set('view engine', 'ejs');

// routes
const routesFiles = fs.readdirSync('./server/routes').filter(file => file.endsWith('.js'));

const emitter = new EventEmitter();

for (const file of routesFiles) {
	const router = require(`./server/routes/${file}`);
	app.use(router.path, new router.Router(emitter).router);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

server.listen(port, async () => {
    console.log(`localhost:${port}`)
    const discordBot = new DiscordBot(emitter);

    discordBot.start();
    console.log('starting...')
    while(
        !discordBot.client.isReady()
    ) {
        await delay(1000);
    }
    console.log('ready!')
    await delay(1000);
    // hooks
    getSocketHook(io, emitter, discordBot);
    getServerHook(emitter, discordBot);
    // shout-outs: 767125564011053129
    // twitch: 883588530436186112
    const shoutOutsChannelId = '767125564011053129',
        twitchChannelId = '883588530436186112';
    cron.schedule('* */2 * * *', function() {
        // game_id=509670 (Science and Technology)
        // game_id=1469308723 (Software and Game Development)
        // language=ar (Arabic)
        const gameIdSAT = 509670,
            gameIdSAGD = 1469308723,
            language = 'ar';
        getStreamersByGameAndLanguage(gameIdSAT, language, (streamersSAT) => {
            getStreamersByGameAndLanguage(gameIdSAGD, language, (streamersSAGD) => {
                const streamersLive = streamersSAT.concat(streamersSAGD);
                getStreamers((streamers) => {
                    // remove streamersLive from streamers
                    const newStreamers = streamers.filter(streamer => !streamersLive.include({user_id: streamer.twitchId}));
                    // add new users to shout-outs
                    if (newStreamers.length > 0) {
                        for(newStreamer in newStreamers){
                            discordBot.sendMessage(shoutOutsChannelId,
                                `https://twitch.tv/${newStreamer.twitchName} is now live!`
                            );
                            postRequest('/streamers', {
                                twitchId: newStreamertwitchId,
                                twitchName: newStreamer.twitchName,
                                streams: 1,
                                isLive: true,
                                lastLive: Date.now()
                            })
                        }
                    }
                    const streamersInDB = streamers.filter(streamer => streamersLive.include({user_id: streamer.twitchId}));
                    if (streamersInDB.length > 0) {
                        for(streamer in streamersInDB){
                            const streamerInDB = streamersInDB[streamer];
                            if (streamerInDB.isLive) {
                                discordBot.sendMessage(shoutOutsChannelId,
                                    `https://twitch.tv/${streamerInDB.twitchName} is still live!`
                                );
                            }
                            postRequest('/streamers', {
                                twitchId: streamerInDB.twitchId,
                                twitchName: streamerInDB.twitchName,
                                streams: streamerInDB.streams + 1,
                                isLive: true,
                                lastLive: Date.now()
                            })
                        }
                    }
                })
            })
        })
    });
});