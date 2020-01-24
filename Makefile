.DEFAULT: build

IMAGE_PREFIX := sourcebin_
BACKEND := backend

#########
# Build #
#########
.PHONY: build
build: build-backend

.PHONY: build-backend
build-backend:
	# build backend image
	docker build $(BACKEND) -t $(IMAGE_PREFIX)$(BACKEND)

#######
# Dev #
#######
.PHONY: dev-backend
dev-backend:
	# run backend container on port 3001
	docker run --env-file .env -p 3001:3000 --rm -it $(IMAGE_PREFIX)$(BACKEND)

#########
# Other #
#########
.PHONY: clean
clean:
	# remove images tagged with the IMAGE_PREFIX
	docker images -a | grep $(IMAGE_PREFIX) | awk '{print $$3}' | xargs docker rmi

.PHONY: prune
prune:
	# clean all that is not actively used
	docker system prune -af
