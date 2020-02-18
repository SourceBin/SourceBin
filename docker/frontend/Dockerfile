###########
# Builder #
###########
FROM node:12.14-alpine AS builder

WORKDIR /usr/src

# Install dependences
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache python make g++
COPY frontend/package*.json ./
RUN npm ci

# Copy source
COPY frontend .

# Set API url
ARG API_URL
ENV API_URL $API_URL

ARG API_URL_BROWSER
ENV API_URL_BROWSER $API_URL_BROWSER

# Build source
RUN npm run build

#########
# Image #
#########
FROM node:12.14-alpine

WORKDIR /usr/src

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci --production

# Copy dist
COPY --from=builder /usr/src/dist dist

# Copy additional files
COPY --from=builder /usr/src/static static
COPY frontend/nuxt.config.js frontend/config.js ./

# Set API url
ARG API_URL
ENV API_URL $API_URL

ARG API_URL_BROWSER
ENV API_URL_BROWSER $API_URL_BROWSER

# Set host
ENV HOST 0.0.0.0

# Set and expose port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]
