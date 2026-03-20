# Usando imagem oficial do PHP com Apache
FROM php:8.2-apache

# Instala certificados SSL e dependências necessárias para compilar extensões
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libcurl4-openssl-dev \
    libonig-dev \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Instala extensões necessárias para Lumen
RUN docker-php-ext-install pdo_mysql curl mbstring

# Habilita mod_rewrite do Apache (necessário para Lumen)
RUN a2enmod rewrite

# Configura o DocumentRoot para a pasta public do Lumen
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Define diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos da API para dentro do contêiner
COPY php-api/ /var/www/html

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1

# Remove vendor copiado do host para evitar conflitos de plataforma
RUN rm -rf /var/www/html/vendor

# Instala dependências do projeto
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Ajusta permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Expõe a porta padrão do Apache
EXPOSE 80

# Comando para iniciar o servidor
CMD ["apache2-foreground"]