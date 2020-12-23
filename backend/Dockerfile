
###########
# Builder #
###########
FROM node:12.14-alpine AS builder

WORKDIR /usr/src

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

#########
# Image #
#########
FROM node:12.14-alpine

WORKDIR /usr/src

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /usr/src/dist dist

CMD ["npm", "run", "start:prod"]
