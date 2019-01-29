FROM node:lts-alpine

WORKDIR /var/app
COPY . .
RUN npm install --only=production --unsafe-perm

EXPOSE 3000
CMD ["npm", "start"]
