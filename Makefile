.DEFAULT: build

include .env

DC = docker-compose $(COMPOSE_FILES)
COMPOSE_FILES = -f docker/docker-compose.yml

ifeq ($(ENV), dev)
	COMPOSE_FILES += -f docker/docker-compose.dev.yml
endif

CERTBOT_DIR = certbot
CERT_DIR = $(CERTBOT_DIR)/letsencrypt/live/$(DOMAIN)
DHPARAM_DIR = $(CERTBOT_DIR)/certs

.PHONY: build
build:
	# build images
	$(DC) build $(SERVICES)

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

$(CERT_DIR):
	# create certificate directory
	mkdir -p $(CERT_DIR)

.PHONY: self-signed-cert
self-signed-cert: | $(CERT_DIR)
	# create a self signed certificate
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout $(CERT_DIR)/privkey.pem \
		-out $(CERT_DIR)/fullchain.pem \
		-subj '/CN=localhost'

$(DHPARAM_DIR):
	# create dhparam directory
	mkdir -p $(DHPARAM_DIR)

.PHONY: dhparam
dhparam: | $(DHPARAM_DIR)
	# create dhparam
	openssl dhparam -out $(DHPARAM_DIR)/dhparam.pem 2048
