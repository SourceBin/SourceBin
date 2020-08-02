.DEFAULT: build

include .env

PWD = $(shell pwd)

DC = docker-compose $(COMPOSE_FILES)
COMPOSE_FILES = -f docker-compose.yml

ifeq ($(ENV), dev)
	COMPOSE_FILES += -f docker-compose.dev.yml
endif

DOMAIN=sourceb.in
SSL_DIR = $(PWD)/ssl

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

$(SSL_DIR):
	# create certificate directory
	mkdir -p $(SSL_DIR) $(SSL_DIR)/certs $(SSL_DIR)/private

.PHONY: self-signed-cert
self-signed-cert: | $(SSL_DIR)
	# create a self signed certificate
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-out $(SSL_DIR)/certs/cert.pem \
		-keyout $(SSL_DIR)/private/key.pem \
		-subj '/CN=localhost'

.PHONY: dhparam
dhparam: | $(SSL_DIR)
	# create dhparam
	openssl dhparam -out $(SSL_DIR)/certs/dhparam.pem 2048
