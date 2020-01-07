FROM node:lts-alpine

WORKDIR /usr/src

# Install dependencies
COPY package.json .
RUN npm i

# Copy source
COPY . .

# Build source
RUN npm run build

# Set and expose port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]
