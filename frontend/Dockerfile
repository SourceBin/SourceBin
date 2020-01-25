FROM node:12.14-alpine

WORKDIR /usr/src

# Install dependences
COPY packages packages
COPY package.json .
RUN npm i

# Copy source
COPY . .

# Build source
RUN npm run build

# Set host
ENV HOST 0.0.0.0

# Set and expose port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]
