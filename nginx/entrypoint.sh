#!/usr/bin/env sh
set -eu

# All templates end with .conf.template
TEMPLATES=/etc/nginx/conf.d/*.conf.template

# Loop over all templates
for TEMPLATE in $TEMPLATES
do
  # Replace the environment variables in the templates and output the config
  envsubst '${DOMAIN} ${FRONTEND_URL} ${BACKEND_URL} ${PROXY_URL}' \
    < "$TEMPLATE" \
    > "${TEMPLATE%.*}"
done

# Execute command
exec "$@"
