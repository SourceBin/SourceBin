.DEFAULT: build

include .env

PWD = $(shell pwd)

DC = docker-compose $(COMPOSE_FILES)
COMPOSE_FILES = -f docker-compose.yml

ifeq ($(ENV), dev)
	COMPOSE_FILES += -f docker-compose.dev.yml
endif

SSL_DIR = $(PWD)/ssl
CERT_DIR = $(SSL_DIR)/certs
PRIVATE_DIR = $(SSL_DIR)/private

CERT = $(CERT_DIR)/cert.pem
DHPARAM = $(CERT_DIR)/dhparam.pem
CLOUDFLARE = $(CERT_DIR)/cloudflare.crt
KEY = $(PRIVATE_DIR)/key.pem

SSL_FILES = $(CERT) $(DHPARAM) $(CLOUDFLARE) $(KEY)

.PHONY: build
build:
	# build images
	$(DC) build $(SERVICES)

.PHONY: run
run:
	# run services in the foreground
	$(DC) up $(SERVICES)

.PHONY: start
start:
	# start services in the background
	$(DC) up -d $(SERVICES)

.PHONY: rebuild
rebuild:
	# rebuild images
	$(DC) up -d --no-deps --build $(SERVICES)

.PHONY: restart
restart:
	# restart services
	$(DC) restart $(SERVICES)

.PHONY: stop
stop:
	# stop services
	$(DC) down

.PHONY: logs
logs:
	# attach to the logs
	$(DC) logs -f --tail=$(or $(TAIL), $(TAIL), 100) $(SERVICES)

.PHONY: clean
clean:
	# remove created images
	$(DC) down --remove-orphans --rmi all

.PHONY: prune
prune:
	# clean all that is not actively used
	docker system prune -af

.env: | .env.example
	# create .env file from the example
	cp .env.example .env

$(SSL_FILES):
	# create ssl file
	mkdir -p "$(shell dirname "$@")" && touch "$@"

.PHONY: self-signed-cert
self-signed-cert: | $(SSL_FILES)
	# create a self signed certificate
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-out $(CERT) \
		-keyout $(KEY) \
		-subj '/CN=localhost'

.PHONY: dhparam
dhparam: | $(SSL_FILES)
	# create dhparam
	openssl dhparam -out $(DHPARAM) 2048
