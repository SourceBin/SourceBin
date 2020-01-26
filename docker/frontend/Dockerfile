FROM node:12.14-alpine

WORKDIR /usr/src

# Install dependences
COPY frontend/packages packages
COPY frontend/package.json .
RUN npm i

# Copy source
COPY frontend .

# Build source
RUN npm run build

# Set host
ENV HOST 0.0.0.0

# Set and expose port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]
