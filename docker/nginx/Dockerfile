FROM nginx:1.17-alpine

# Copy config files
COPY nginx/conf.d /etc/nginx/conf.d
COPY nginx/snippets /etc/nginx/snippets

# Copy entrypoint
COPY nginx/entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
