# transcendence-backend

Backend monorepo de NestJS para `ft_transcendence`, organizado en `apps/*` y comunicado por NATS.

## Arquitectura

- `gateway`: unico servicio HTTP publico
- `auth`: microservicio NATS para registro, login y verificacion JWT
- `user`: microservicio NATS para perfil de usuario
- `game`: microservicio NATS base con `health`
- `tournament`: microservicio NATS base con `health`
- `database`: PostgreSQL compartida en esta primera fase
- `nats-server`: broker interno entre servicios

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=transcendence

DATABASE_URL=postgresql://postgres:postgres@database:5432/transcendence

JWT_SECRET=change_me
JWT_EXPIRES_IN=7d

NATS_SERVERS=nats://nats-server:4222
GATEWAY_PORT=3000
REQUEST_TIMEOUT_MS=5000
```

`DATABASE_URL` sirve para comandos locales de Prisma. En Docker Compose cada servicio recibe su `DATABASE_URL` interna automaticamente.

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Levantar todo con Docker:

```bash
docker compose up --build
```

Servicios expuestos:

- `gateway`: `http://localhost:3000`
- `postgres`: `localhost:5432`
- `nats`: `localhost:4222`

## Scripts utiles

```bash
npm run build:all
npm run start:dev:gateway
npm run start:dev:auth
npm run start:dev:user
npm run start:dev:game
npm run start:dev:tournament
npm run test
npm run test:e2e:gateway
```

## Endpoints HTTP del gateway

- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`
- `GET /health`

## Contratos NATS

- `auth.register`
- `auth.login`
- `auth.verify`
- `auth.health.check`
- `user.me`
- `user.health.check`
- `game.health.check`
- `tournament.health.check`

## Pruebas manuales

Con el stack levantado:

```bash
chmod +x test.sh && ./test.sh
```
