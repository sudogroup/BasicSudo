const express = require('express');

const { Streamer } = require("../models/Streamer");

class Router {
    constructor(emitter) {
        this.router = express.Router();
        this.emitter = emitter
        // add a new streamer
        this.router.post('/', async (req, res) => {
            console.log(`(streamer) POST:`)

            const streamer = new Streamer(req.body);

            await streamer.save();
            
            res.send(streamer)

            this.emitter.emit('streamer:new', streamer)
        })

        // update a streamer
        this.router.put('/:key/:value', async (req, res) => {
            const key = req.params.key,
                value = req.params.value;
            console.log(`(streamer) UPDATE: ${key}:${value}`)

            if (key !== 'twitchId' && key !== 'twitchName' && key !== 'discordId') {
                return res.status(400).send('Invalid key');
            }

            let streamer = null
            if (key === 'twitchId') streamer = await Streamer.updateOne({ twitchId: value },{ $set: req.body });
            else if (key === 'twitchName') streamer = await Streamer.updateOne({ twitchName: value },{ $set: req.body });
            else if (key === 'discordId') streamer = await Streamer.updateOne({ discordId: value },{ $set: req.body });

            res.json(streamer)

            this.emitter.emit('streamer:update', streamer)
        })

        // delete a streamer
        this.router.delete('/:key/:value', async (req, res) => {
            const key = req.params.key,
                value = req.params.value;
            
            console.log(`(streamer) DELETE: ${key}:${value}`)

            if (key !== 'twitchId' && key !== 'twitchName' && key !== 'discordId') {
                return res.status(400).send('Invalid key');
            }

            let streamer = null
            if (key === 'twitchId') {
                streamer = await Streamer.findOne({ twitchId: value });
                await Streamer.deleteOne({ twitchId: value });
            }
            else if (key === 'twitchName') {
                streamer = await Streamer.findOne({ twitchName: value });
                await Streamer.deleteOne({ twitchName: value });
            }
            else if (key === 'discordId') {
                streamer = await Streamer.findOne({ discordId: value });
                await Streamer.deleteOne({ discordId: value });
            }

            res.json(streamer)

            this.emitter.emit('streamer:delete', streamer)
        })

        // get a streamer
        this.router.get('/:key/:value', async (req, res) => {
            const key = req.params.key,
                value = req.params.value;
            console.log(`(streamer) GET: ${key}:${value}`)

            if (key !== 'twitchId' && key !== 'twitchName' && key !== 'discordId') {
                return res.status(400).send('Invalid key');
            }

            let streamer = null
            if (key === 'twitchId') streamer = await Streamer.findOne({ twitchId: value });
            else if (key === 'twitchName') streamer = await Streamer.findOne({ twitchName: value });
            else if (key === 'discordId') streamer = await Streamer.findOne({ discordId: value });

            res.json(streamer)

            this.emitter.emit('streamer:get', streamer)
        })

        // get all streamers
        this.router.get('/', async (req, res) => {
            console.log(`(streamer) GET: ALL`)
            const streamers = await Streamer.find();
            res.json(streamers)

            this.emitter.emit('streamer:all', streamers)
        })
    }
}

module.exports = { path: "/streamer", Router };