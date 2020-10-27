###########
# Builder #
###########
FROM node:12.14-alpine AS builder

WORKDIR /usr/src

# Set stripe key
ARG STRIPE_PUBLIC_KEY
ENV STRIPE_PUBLIC_KEY $STRIPE_PUBLIC_KEY

# Set cdn base url
ARG CDN_BASE_URL
ENV CDN_BASE_URL $CDN_BASE_URL

# Install dependences
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache python make g++ git
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build source
RUN npm run build

#########
# Image #
#########
FROM node:12.14-alpine

WORKDIR /usr/src

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

# Install dependencies
RUN apk add --no-cache git
COPY package*.json ./
RUN npm ci --production

# Copy dist
COPY --from=builder /usr/src/dist dist

# Copy additional files
# TODO: don't copy all assets over
COPY --from=builder /usr/src/assets assets
COPY --from=builder /usr/src/static static
COPY nuxt.config.js config.js ./

CMD ["npm", "start"]
