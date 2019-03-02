FROM node:lts-alpine

WORKDIR /var/sourcebin

# Install dependencies
COPY utils/package.json utils/package.json
COPY api/package.json api/package.json
RUN npm install --only=production --prefix api

# Copy src files
COPY utils utils
COPY api api

EXPOSE 3001
CMD ["npm", "start", "--prefix", "api"]
