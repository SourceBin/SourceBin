<div align="center">
  <a href="https://src.gg/d"><img src="https://img.shields.io/discord/531491560567734292.svg?color=7289DA&label=DISCORD&logo=discord&style=for-the-badge" alt="Discord" /></a>
  <a href="https://src.gg/t"><img src="https://img.shields.io/twitter/follow/sourcebinapp?color=1DA1F2&label=TWITTER&logo=twitter&style=for-the-badge" alt="Twitter" /></a>
</div>

# SourceBin

SourceBin makes sharing code easy by providing an easy to use pastebin service. This repository contains the core services of SourceBin. Feel free to report any issues and suggestions in this repository.

## Development

1. Download or clone the repository
2. Run `make .env`
3. Edit the configuration in the `.env` file
4. Run `make self-signed-cert dhparam` to generate local certificates
5. Run `make ENV=dev run`
6. Start developing

## Deploying

1. Download or clone the repository
2. Run `make .env`
3. Edit the configuration in the `.env` file
4. Run `make dhparam` to generate dhparam
5. Add SSL cert in `ssl/certs/cert.pem` and `ssl/private/key.pem`
6. Point domain to server
7. Run `make start`

## Note

While we try to open-source as much as possible, SourceBin is not made for self-hosting. We will not provide support for hosting your own instance.
