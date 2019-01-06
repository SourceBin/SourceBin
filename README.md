# SourceBin
**SourceBin** is an open-source bin website that allows you to share code snippets in over 450 different programming languages.
It uses MongoDB as the database and ace editor for the interface.

The site can be found at [sourceb.in](https://sourceb.in). You can also join the [discord server](https://discord.gg/EkX2X2F).

## Installation
1. Download or clone the repository
2. Run `npm install`
3. Setup the config (info below)
3. Run `node index.js`

## Config
You have to create a file called `config.json` in the root folder of the project and include the following things in it:
```json
{
  "database": "mongodb database uri",
  "oauth2": {
    "uri": "oauth2 uri",
    "client_secret": "oauth2 client secret"
  }
}
```
