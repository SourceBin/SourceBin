FROM nginx:1.17-alpine

# Copy config files
COPY conf.d /etc/nginx/conf.d
COPY snippets /etc/nginx/snippets

# Copy entrypoint
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
