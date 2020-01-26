FROM nginx:1.17-alpine

# Copy config files
COPY src /etc/nginx

# Copy entrypoint
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
