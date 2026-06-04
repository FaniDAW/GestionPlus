# GestionPlus
SaaS de gestión de fidelización y puntos para comercios locales, asociaciones y municipios.

> La documentación completa del proyecto se encuentra en la memoria técnica. Este README cubre únicamente la instalación y ejecución del entorno.

## Requisitos

- Docker
- Docker Compose

## Instalación y ejecución

1. **Descomprimir el archivo del proyecto** y situarse en la carpeta resultante:

   ```bash
   cd GestionPlus
   ```

2. **Generar los certificados SSL autofirmados**

   ```bash
   mkdir -p ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout ssl/gestionplus.app-key.pem \
     -out ssl/gestionplus.app.pem \
     -subj "/C=ES/ST=Alicante/L=Benidorm/O=GestionPlus/CN=gestionplus.app"
   ```

3. **Añadir el dominio local** al archivo `/etc/hosts` (en Windows: `C:\Windows\System32\drivers\etc\hosts`):

   ```
   127.0.0.1   gestionplus.app
   ```

4. **Levantar el entorno**

   ```bash
   docker compose up -d --build
   ```

   Espera a que `docker compose ps` muestre `gestionplus_db` como `healthy`.

5. **Preparar la base de datos** (migraciones + datos de prueba)

   ```bash
   docker compose exec backend php artisan migrate:fresh --seed --force
   ```

6. **Acceder**: https://gestionplus.app

   > El navegador mostrará un aviso por el certificado autofirmado (normal en local). Acéptalo para entrar.

## Credenciales de prueba

Contraseña para todos: **`Test1234`**

| Rol                      | Email                  |
|--------------------------|------------------------|
| Administrador plataforma | admin@gestionplus.com  |
| Propietario de negocio   | negocio@test.com       |
| Administrador asociación  | asociacion@demo.com    |
| Cliente                  | cliente@test.com       |

## Notas

- Las claves de Stripe y del correo no se incluyen por seguridad (`.env.example` vacío). La app es navegable sin ellas; para activar pagos y emails, rellenar las variables `STRIPE_*` y `MAIL_*` en `Backend/.env`.
- El escáner QR requiere que el móvil y el servidor estén en la misma red local.
- Código fuente y historial de desarrollo disponibles en el repositorio GitHub del proyecto.
