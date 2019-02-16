FROM node:lts-alpine

WORKDIR /var/app
COPY api .
COPY utils ../utils
RUN npm install --only=production

EXPOSE 3001
CMD ["npm", "start"]
