# transcendence-backend

Backend del proyecto ft_transcendence (42). Arquitectura de microservicios con NestJS, PostgreSQL y Docker.

## Requisitos previos

| Herramienta | Version minima | Instalacion |
|-------------|---------------|-------------|
| Docker      | 24+           | https://docs.docker.com/get-docker/ |
| Docker Compose | v2 (plugin) | incluido con Docker Desktop |
| Node.js     | 22+           | https://nodejs.org/ |
| npm         | 10+           | incluido con Node.js |

> Si solo vas a levantar el proyecto con Docker no necesitas Node ni npm en tu maquina.

## Variables de entorno

Crea un archivo `.env` en la raiz del repo (junto al `docker-compose.yml`):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=transcendence

DATABASE_URL=postgresql://postgres:postgres@database:5432/transcendence

JWT_SECRET=cambia_esto_por_algo_seguro
```

> `database` en `DATABASE_URL` es el nombre del servicio en docker-compose, no `localhost`.

## Levantar el proyecto

```bash
docker compose up --build
```

Servicios disponibles:

| Servicio  | Puerto | Descripcion                  |
|-----------|--------|------------------------------|
| database  | 5432   | PostgreSQL                   |
| gateway   | 3000   | Gateway (entrada principal)  |
| auth      | 3001   | Registro y login             |
| user      | 3002   | Perfil de usuario            |

## Migraciones de base de datos

Las migraciones se aplican automaticamente al arrancar si el schema no ha cambiado.
Si modificas `prisma/schema.prisma`:

```bash
# Generar y aplicar migracion
npx prisma migrate dev --name nombre_del_cambio

# Solo generar el cliente (sin migrar)
npx prisma generate
```

## Probar los endpoints

```bash
chmod +x test.sh && ./test.sh
```

El script prueba:
- `POST /auth/register` — crear usuario
- `POST /auth/login` — obtener JWT
- `GET /users/me` — perfil protegido con token
- Login con contraseña incorrecta (debe fallar)
- Acceso sin token (debe fallar)

## Estructura

```
apps/
  gateway/     Puerto 3000 — enrutamiento (pendiente NATS)
  auth/        Puerto 3001 — registro, login, JWT
  user/        Puerto 3002 — perfil de usuario
  game/        (pendiente) — logica del Pong
  tournament/  (pendiente) — brackets y torneos
prisma/
  schema.prisma
prisma.config.ts
docker-compose.yml
test.sh
```

## Parar el proyecto

```bash
docker compose down          # para y elimina contenedores
docker compose down -v       # tambien elimina el volumen de PostgreSQL (borra todos los datos)
```
