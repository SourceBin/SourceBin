.DEFAULT: build

COMPOSE_FILES := -f docker-compose.yml
DC := docker-compose $(COMPOSE_FILES)

SERVICES := $(or $(SERVICES), $(SERVICES), )

.PHONY: build
build:
	# build images
	$(DC) build $(SERVICES)

.PHONY: rebuild
rebuild:
	# rebuild images without cache
	$(DC) build --no-cache $(SERVICES)

.PHONY: start
start:
	# start services in the background
	$(DC) up -d $(SERVICES)

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
