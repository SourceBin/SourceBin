FROM node:12.14-alpine

WORKDIR /usr/src

# Install dependences
COPY packages ../packages
COPY frontend/package*.json ./
# RUN npm i

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache --virtual .gyp python make g++ \
    && npm i \
    && apk del .gyp

# Copy source
COPY frontend .

# Set API url
ARG API_URL
ENV API_URL $API_URL

ARG API_URL_BROWSER
ENV API_URL_BROWSER $API_URL_BROWSER

# Build source
RUN npm run build

# Set host
ENV HOST 0.0.0.0

# Set and expose port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]
