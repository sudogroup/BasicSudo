require('dotenv').config({path:'../.env'});

const express = require('express'),
    fs = require('fs'),
    http = require('http'),
    { EventEmitter } = require("events"),
    { Server } = require("socket.io");

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

});