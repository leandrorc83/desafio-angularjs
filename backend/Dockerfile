FROM phpdockerio/php72-fpm:latest

WORKDIR /usr/src/app

RUN mkdir /usr/src/app/backend

WORKDIR /usr/src/app/backend

COPY . .

#RUN cp .env.example .env

#WORKDIR /usr/src/app/backend/storage

#RUN cp database.example.sqlite database.sqlite

# Install selected extensions and other stuff
RUN apt-get update \
    && apt-get -y --no-install-recommends install libmcrypt-dev php7.2-sqlite3 \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

#WORKDIR /usr/src/app/backend/

#RUN php artisan migrate
