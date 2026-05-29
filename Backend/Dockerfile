FROM php:8.2-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN a2enmod rewrite

# Copiar el proyecto
WORKDIR /var/www/html
COPY . .

# Instalar dependencias de Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache


##### configuracion docker
# Copiar el .env de producción
RUN cp .env.docker .env

# Generar la APP_KEY
RUN php artisan key:generate --force

# Optimizar Laravel para producción
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache



EXPOSE 80
