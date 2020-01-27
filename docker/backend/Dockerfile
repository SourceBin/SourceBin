###########
# Builder #
###########
FROM node:12.14-alpine AS builder

WORKDIR /usr/src

# Install dependencies
COPY backend/package*.json ./
RUN npm i

# Copy source
COPY backend .

# Build source
RUN npm run build

#########
# Image #
#########
FROM node:12.14-alpine

WORKDIR /usr/src

# Install dependencies
COPY backend/package*.json ./
RUN npm i --production

# Copy dist
COPY --from=builder /usr/src/dist dist

# Set and expose port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]
