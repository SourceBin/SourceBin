FROM node:lts-alpine

WORKDIR /var/app
COPY app .
COPY utils ../utils
RUN npm install --only=production

EXPOSE 3000
CMD ["npm", "start"]
