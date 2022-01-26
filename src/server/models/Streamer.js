const mongoose = require('mongoose');

const twitchInfo = {  
    twitchName: { type: String, required: true, },
    twitchId: { type: String, required: true },
    isLive: { type: Boolean, default: false },
    lastLive: { type: Date, default: Date.now },
}

const twitchStats = {  
    streams: { type: Number, default: 1 },
}

const streamerSchema = new mongoose.Schema({
    ...twitchInfo,
    ...twitchStats,
});

module.exports = { 
    Streamer: mongoose.model('Streamers', streamerSchema) 
}