#!/usr/bin/env bash

RESET="\e[0m"
BOLD="\e[1m"
GREEN="\e[92m"
CYAN="\e[96m"

QUESTION="$RESET$BOLD$GREEN?$RESET$BOLD"
ARROW="$RESET$BOLD$GREEN❯$RESET$BOLD"


# ----- Config ----- #
create_api_config() {
  eval "$1='{
  \"database\": \"$2\"
}'"
}

create_app_config() {
  eval "$1='{
  \"database\": \"$2\",
  \"oauth2\": {
    \"uri\": \"$3\",
    \"client_secret\": \"$4\"
  }
}'"
}
# ----- Config ----- #


# ----- Non-interactive ----- #
case $1 in
  -n|--non-interactive)
    echo -e "\n$ARROW Installing root packages $RESET"
    npm install

    echo -e "\n$ARROW Installing packages for api $RESET"
    npm install --prefix api

    echo -e "\n$ARROW Installing packages for app $RESET"
    npm install --prefix app

    echo -e "$ARROW Creating config files $RESET"

    api_config=""
    create_api_config api_config "db"
    echo "$api_config" > ./api/config.json

    app_config=""
    create_app_config app_config "db" "https://discordapp.com/api/oauth2/authorize?client_id=some_id&redirect_uri=some_redirect&response_type=code&scope=identify" "oauth2_client_secret"
    echo "$app_config" > ./app/config.json

    echo -e "$ARROW Finished! $RESET"
    exit 0
esac
# ----- Non-interactive ----- #


# ----- Root ----- #
echo -e "\n$ARROW Installing root packages $RESET"
npm install
# ----- Root ----- #


# ----- API ----- #
echo -e "\n$ARROW Installing packages for api $RESET"
npm install --prefix api

if [ ! -f ./api/config.json ]; then
  echo -e "\n$ARROW ./api/config.json does not exist yet, creating file"

  while true; do
    echo -e -n "$QUESTION Please enter a MongoDB database uri: $RESET$CYAN"
    read database

    config=""
    create_api_config config $database

    echo -e "\n$ARROW Saving the following config: $RESET\n$config"
    echo -e -n "$QUESTION Is this correct? [y/N]: $RESET$CYAN"
    read -r -n 1 confirmation

    case $confirmation in
      [yY]) echo; break;;
      *) echo;;
    esac
  done

  echo "$config" > ./api/config.json
fi
# ----- API ----- #


# ----- APP ----- #
echo -e "\n$ARROW Installing packages for app $RESET"
npm install --prefix app

if [ ! -f ./app/config.json ]; then
  echo -e "\n$ARROW ./app/config.json does not exist yet, creating file"

  while true; do
    echo -e -n "$QUESTION Please enter a MongoDB database uri: $RESET$CYAN"
    read database

    echo -e -n "$QUESTION Please enter a Discord oauth2 uri: $RESET$CYAN"
    read oauth2_uri

    echo -e -n "$QUESTION Please enter your Discord oauth2 client_secret: $RESET$CYAN"
    read oauth2_client_secret

    config=""
    create_app_config config $database $oauth2_uri $oauth2_client_secret

    echo -e "\n$ARROW Saving the following config: $RESET\n$config"
    echo -e -n "$QUESTION Is this correct? [y/N]: $RESET$CYAN"
    read -r -n 1 confirmation

    case $confirmation in
      [yY]) echo; break;;
      *) echo;;
    esac
  done

  echo "$config" > ./app/config.json
fi
# ----- APP ----- #


echo -e "\n$ARROW Finished! $RESET"
