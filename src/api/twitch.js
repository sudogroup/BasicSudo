require('dotenv').config({path:'../../.env'});

const axios = require('axios');

const TWITCH_API_URL = `https://api.twitch.tv/helix`,
    TWITCH_ID_URL = `https://id.twitch.tv/oauth2/token`;

function getRequestTwitch(url, cb) {
    axios.get(`${TWITCH_API_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
        }
    })
    .then(async res => {
        const data = await res.data
        if(cb) return cb(data)
        return data
    }).catch(err => { 
        if (err.response.status === 429) {
            console.log('Rate limit reached. Retrying in 5 seconds...')
            setTimeout(() => {
                getRequestTwitch(url, cb)
            }, 5000)
        }
        console.log(err)
    })
}

function getRequestTwitchToken(url, token, cb) {
    axios.get(`${TWITCH_API_URL}${url}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(async res => {
        const data = await res.data
        if(cb) return cb(data)
        return data
    }).catch(err => console.log(err))
}
function postRequestTwitchToken(url, token, cb) {
    axios.post(`${TWITCH_API_URL}${url}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Client-ID": process.env.TWITCH_CLIENT_ID,
        }
    })
    .then(async res => {
        const data = await res.data
        if(cb) return cb(data)
        return data
    }).catch(err => console.log(err))
}

function postRequestTwitch(url, args, cb) {
    axios.post(`${TWITCH_API_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
        }
    }, args)
    .then(async res => {
        const data = await res.data
        if(cb) return cb(data)
        return data
    }).catch(err => { 
        if (err.response.status === 429) {
            console.log('Rate limit reached. Retrying in 5 seconds...')
            setTimeout(() => {
                getRequestTwitch(url, cb)
            }, 5000)
        }
        console.log(err)
    })
}

// source: https://github.com/thedist/Twitch-Webhook-AWS-Tutorial/blob/master/src/twitch-webhook-create/index.js
function getAppToken(cb) {
    axios.post(
        `${TWITCH_ID_URL}?` + 
        `client_id=${process.env.TWITCH_CLIENT}&` + 
        `client_secret=${process.env.TWITCH_SECRET}&` + 
        `grant_type=client_credentials`)
    .then(async res => {
        const data = await res.data
        if(cb) return cb(data)
        return data
    }).catch(err => console.log(err))
}

module.exports = {
    getRequestTwitch,
    postRequestTwitch,
    getAppToken,
    postRequestTwitchToken,
    getFollowers(twitchId, cb) {
        getRequestTwitch(`/users?from_id=${twitchId}&first=1`, (data) => {
            if(cb) return cb(data.total);
            return data.total;
        })
    },
    getUser(twitchName, cb) {
        getRequestTwitch(`/users?login=${twitchName}`, (data) => {
            if(cb) {
                if (data.data.length === 0) {
                    return cb(null);
                }
                return cb(data.data[0])
            }
            else {
                if (data.data.length === 0) {
                    return null;
                }
                return data
            }
        })
    },
    // [
    //     {
	// 		"id": "45230807853",
	// 		"user_id": "107939114", // twitchId
	// 		"user_login": "dutchsinseofficial", // twitchName
	// 		"user_name": "DutchsinseOfficial",
	// 		"game_id": "509670",
	// 		"game_name": "Science & Technology",
	// 		"type": "live",
	// 		"title": "Live Earthquakes 24/7 -- past 48hrs up to current",
	// 		"viewer_count": 224,
	// 		"started_at": "2022-01-21T14:10:40Z", // lastLive
	// 		"language": "en",
	// 		"thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_dutchsinseofficial-{width}x{height}.jpg",
	// 		"tag_ids": [
	// 			"6ea6bca4-4712-4ab9-a906-e3336a9d8039"
	// 		],
	// 		"is_mature": false
    //     }
    // ]
    getStreamersByGameAndLanguage(game, language, cb) {
        getRequestTwitch(`/streams?game_id=${game}&language=${language}`, (data) => {
            if(cb) return cb(data.data);
            return data.data;
        })
    },
    // clips - https://dev.twitch.tv/docs/api/reference#get-clips
    // game_id, game_name, type (live), title, viewer_count, start_at, is_mature 
    getStreams(twitchId, cb) {
        console.log(twitchId)
        getRequestTwitch(`/streams?user_id=${twitchId}&first=1`, (data) => {
            if(cb) return cb(data.data[0]);
            return data
        })
    },
    // source: https://github.com/thedist/Twitch-Webhook-AWS-Tutorial/blob/master/src/twitch-webhook-create/index.js
    checkSubscriptions(token, cb) {
        getRequestTwitchToken(`/webhooks/subscriptions`, token, (data) => {
            if(cb) return cb(data);
            return data
        })
    },
    // webhook = {
    //     channel: '32168215',
    //     type: 'follows',
    //     topic: 'https://api.twitch.tv/helix/users/follows?first=1&to_id=32168215'
    // };
    // source: https://github.com/thedist/Twitch-Webhook-AWS-Tutorial/blob/master/src/twitch-webhook-create/index.js
    createSubscription(webhook, subscriptions, cb) {
        // Check if subscription both exists and has at least 2 hours remaining on the lease
        const sub = subscriptions.data.find(item => item.topic === webhook.topic);
        if (sub && (new Date(sub.expires_at) - new Date()) / 3600000 > 2) return;
        
        const args = {
            'hub.callback': `${process.env.DOMAIN}?channel=${webhook.channel}&type=${webhook.type}`,
            'hub.mode': 'subscribe',
            'hub.topic': webhook.topic,
            'hub.lease_seconds': 86400,
            'hub.secret': process.env.WEBHOOK_SECRET
        }
        postRequestTwitch(`/webhooks/hub`, webhook, args, (data) => {
            if(cb) return cb(data);
            return data
        })
    }
}