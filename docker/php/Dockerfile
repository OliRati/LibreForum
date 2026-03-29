FROM php:8.4-fpm

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libicu-dev \
    libonig-dev \
    libzip-dev \
    zip \
    && rm -rf /var/lib/apt/lists/*

# Installer extensions PHP
RUN docker-php-ext-configure intl
RUN docker-php-ext-install \
    intl \
    pdo \
    pdo_mysql \
    zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html