# BasicSudo

:star: Star us on GitHub — it motivates us a lot!

This is a Discord/Twitch bot to manage `SudoGroup` server.

## Table of content

- [Installation](#installation)
- [Setup](#setup)
- [Contributing](#contributing)
- [License](#license)

## Installation

- Clone the repo on your machine using [git](https://git-scm.com/) or use [this link](https://github.com/sudogroup/OnlySudo/archive/refs/heads/main.zip) to download a `.zip` file of the project.
- Install [Node.js](https://nodejs.org/en/).
- Access the project folder and create .env file. Follow [`.env` file setup](#setup).
- Edit the following:
    - Line 4 in `src/index.js` to include the right channels where the bot will be join.
- Open `src` from the terminal and run the following:
```bash
# to install packages
npm i
# to run the server
nodemon
```

## Setup

The content of the `.env` would be the following:

```.env
# development
PORT=5000
BASE_URL=http://localhost:5000

# General
PREFIX=!

# Discord bot
DISCORD_CLIENT_ID=XXX
DISCORD_TOKEN=XXX
DISCORD_GUILD_ID=XXX

# Twitch bot
TWITCH_ACCESS_TOKEN=XXX
TWITCH_CLIENT_ID=XXX
TWITCH_BOT_USERNAME=XXX
```

Instructions to get the required values:
- `DISCORD_CLIENT_ID` and `DISCORD_TOKEN`:
  -  Access [Developer Portal](https://discord.com/developers/applications) then create a `New Application` if you don't have a bot already
  -  Click on the bot
     -  Select `OAuth2` then copy `CLIENT ID` (this is for `DISCORD_CLIENT_ID`)
     -  Select Bot then copy `TOKEN` (this is for `DISCORD_TOKEN`)
- `DISCORD_GUILD_ID`: Follow [this link](https://www.remote.tools/remote-work/how-to-find-discord-id#how-to) to setup `Developer Mode` and to get your server's ID (aka `DISCORD_GUILD_ID`)
- `TWITCH_ACCESS_TOKEN` and `TWITCH_CLIENT_ID`: Follow [this link](https://twitchtokengenerator.com/)
- `TWITCH_BOT_USERNAME`: This is your bot's twitch username (lower cased)

If you want the images to be accessed externally, use [`ngrok`](https://ngrok.com/) and replace `BASE_URL` value in `src/index.js` with the new url.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)