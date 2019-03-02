FROM node:lts-alpine

WORKDIR /var/sourcebin

# Install dependencies
COPY utils/package.json utils/package.json
COPY app/package.json app/package.json
RUN npm install --only=production --prefix app

# Copy src files
COPY utils utils
COPY app app

EXPOSE 3000
CMD ["npm", "start", "--prefix", "app"]
