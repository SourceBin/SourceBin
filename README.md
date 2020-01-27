<div align="center">
  <a href="https://discord.gg/EkX2X2F"><img src="https://img.shields.io/discord/531491560567734292.svg?color=blue&label=DISCORD&style=for-the-badge" alt="Discord" /></a>
  <a href="https://www.patreon.com/synteklang"><img src="https://img.shields.io/badge/patreon-donate-orange.svg?style=for-the-badge" alt="Patreon" /></a>
</div>

# SourceBin

SourceBin is an open-source pastebin service supporting 450+ languages. SourceBin can be reached at [sourceb.in](https://sourceb.in).

## Development

You can help the development of SourceBin by opening a PR. Follow the steps below to get started.

1. Download or clone the repository
2. Run `make .env`
3. Edit the configuration in the `.env` file
4. Run `make self-signed-cert dhparam` to generate local certificates
5. Start developing

## Deploying

The following steps outline how you can deploy SourceBin.

1. Download or clone the repository
2. Run `make .env`
3. Edit the configuration in the `.env` file
4. Point domain to server
5. Run `make cert dhparam` to generate certificates
6. Run `make ENV=prod start`
