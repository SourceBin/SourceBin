.DEFAULT: build

include .env

PWD = $(shell pwd)

DC = docker-compose $(COMPOSE_FILES)
COMPOSE_FILES = -f docker-compose.yml

ifeq ($(ENV), dev)
	COMPOSE_FILES += -f docker-compose.dev.yml
else ifeq ($(ENV), prod)
	COMPOSE_FILES += -f docker-compose.prod.yml
endif

CERTBOT_DIR = $(PWD)/certbot
CERT_DIR = $(CERTBOT_DIR)/letsencrypt/live/$(DOMAIN)
DHPARAM_DIR = $(CERTBOT_DIR)/certs

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

.PHONY: cert
cert:
	# create a certificate
	docker run --rm -it \
		-p 80:80 -p 443:443 \
		-v $(CERTBOT_DIR)/letsencrypt:/etc/letsencrypt \
		certbot/certbot \
		certonly --standalone -n --agree-tos -m $(EMAIL) -d $(DOMAIN)

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
