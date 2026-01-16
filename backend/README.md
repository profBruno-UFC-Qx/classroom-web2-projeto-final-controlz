# Backend (Node.js + Express + TypeORM + SQLite + TypeScript)

## Como rodar

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:3333`

## Seed (criar admin)

```bash
cd backend
npm run seed
```

Env (opcional):
- `ADMIN_EMAIL` (default: `admin@local.test`)
- `ADMIN_PASSWORD` (default: `admin123`)
- `ADMIN_NAME` (default: `Administrador`)

## Variáveis de ambiente (opcional)
- `PORT` (default: `3333`)
- `DB_FILE` (default: `db.sqlite`)
- `JWT_SECRET` (default: `dev-secret-change-me`)
- `JWT_EXPIRES_IN` (default: `1d`)

## Endpoints

### Público
- `GET /health`
- `GET /opportunities?page=&limit=&category=&city=&institutionId=&isActive=`
  - paginação: `page` e `limit`
  - filtros: `category`, `city`, `institutionId`, `isActive`

### Auth (JWT)
- `POST /auth/register` (role: `aluno` ou `instituicao`)
- `POST /auth/login`
- `GET /auth/me` (protegida)
- `POST /auth/logout` (protegida, stateless)

### Usuários
- `GET /users/me` (protegida)
- `PUT /users/me` (protegida)
- `DELETE /users/me` (protegida)
- `GET /users?page=&limit=&role=&email=` (protegida, role `admin`)
- `POST /users` (protegida, role `admin`)
- `GET /users/:id` (protegida, role `admin`)
- `PUT /users/:id` (protegida, role `admin`)
- `DELETE /users/:id` (protegida, role `admin`)

### Instituições
- `GET /institutions/me` (protegida, role `instituicao`)
- `PUT /institutions/me` (protegida, role `instituicao`)
- `GET /institutions?status=pending&page=&limit=` (protegida, role `admin`)
- `POST /institutions/:id/approve` (protegida, role `admin`)
- `POST /institutions/:id/reject` (protegida, role `admin`)

### Oportunidades
- `POST /opportunities` (protegida, role `admin` ou `instituicao`)
- `PUT /opportunities/:id` (protegida, role `admin` ou `instituicao`)
- `DELETE /opportunities/:id` (protegida, role `admin` ou `instituicao`)

### Candidaturas
- `POST /applications` (protegida, role `aluno`)
- `GET /applications/me?page=&limit=&status=&opportunityId=` (protegida, role `aluno`)
- `GET /applications/institution?page=&limit=&status=&opportunityId=&studentId=` (protegida, role `instituicao`)
- `GET /applications?page=&limit=&status=&opportunityId=&studentId=` (protegida, role `admin`)
- `PATCH /applications/:id/status` (protegida, role `admin` ou `instituicao`)

## Exemplo rápido (curl)

Login:
```bash
curl -X POST http://localhost:3333/auth/login -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@local.test\",\"password\":\"admin123\"}"
```

Listar oportunidades (público):
```bash
curl "http://localhost:3333/opportunities?page=1&limit=10&city=Fortaleza"
```