FROM nginx:alpine

RUN apk add openssl
RUN mkdir /etc/ssl/certs
RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

RUN apk update
RUN apk add python3
RUN pip3 install --upgrade pip
RUN pip install python-crontab

RUN apk add certbot
RUN pip install certbot-nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./config/config.conf /etc/nginx/conf.d/default.conf
COPY ./config/ssl-params.conf /etc/nginx/snippets/ssl-params.conf

WORKDIR /var/app/
COPY index.py .
COPY domains.json .

EXPOSE 80 443
CMD ["python3", "index.py"]
