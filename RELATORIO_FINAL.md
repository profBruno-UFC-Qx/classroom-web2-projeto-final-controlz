## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**
- Vue 3 (Composition API com `<script setup>`)
- Vue Router 4
- Pinia 3
- TypeScript
- Vuetify 3 (Material Design)
- Axios
- Material Design Icons

**Backend:**
- Node.js
- Express 4
- TypeORM 0.3
- SQLite 3
- JWT (jsonwebtoken)
- bcryptjs
- TypeScript
- CORS

## :shipit: Operações implementadas para cada entidade da aplicação

| Entidade | Criação | Leitura | Atualização | Remoção |
| -------- | -------- | -------- | -------- | -------- |
| User (Usuário) | ✅ | ✅ | ✅ | ✅ |
| Institution (Instituição) | ✅ (upsert) | ✅ | ✅ | ❌ |
| VolunteerOpportunity (Oportunidade) | ✅ | ✅ | ✅ | ✅ |
| Application (Candidatura) | ✅ | ✅ | ✅ (status) | ❌ |

**Observações:**
- **User**: CRUD completo (Admin pode gerenciar todos, usuário pode gerenciar próprio)
- **Institution**: CREATE via upsert (`PUT /institutions/me`), READ, UPDATE (Admin pode aprovar/rejeitar)
- **VolunteerOpportunity**: CRUD completo (Instituição gerencia próprias, Admin gerencia todas)
- **Application**: CREATE (aluno se candidata), READ (com paginação e filtros), UPDATE status (instituição/admin)

## :neckbeard: Rotas da API REST utilizadas

### Autenticação (Público)
| Método HTTP | URL | Descrição |
| ----------- | --- | --------- |
| POST | /auth/register | Registro de novo usuário (aluno ou instituição) |
| POST | /auth/login | Login e obtenção de token JWT |
| POST | /auth/logout | Logout (protegida) |
| GET | /auth/me | Obter dados do usuário autenticado (protegida) |

### Oportunidades
| Método HTTP | URL | Descrição |
| ----------- | --- | --------- |
| GET | /opportunities | Lista oportunidades públicas (com paginação e filtros: category, city, institutionId, isActive) |
| POST | /opportunities | Criar oportunidade (protegida: Admin, Instituição) |
| PUT | /opportunities/:id | Atualizar oportunidade (protegida: Admin, Instituição) |
| DELETE | /opportunities/:id | Deletar oportunidade (protegida: Admin, Instituição) |

### Instituições
| Método HTTP | URL | Descrição |
| ----------- | --- | --------- |
| GET | /institutions/me | Obter perfil da própria instituição (protegida: Instituição) |
| PUT | /institutions/me | Criar/atualizar perfil da instituição (protegida: Instituição) |
| GET | /institutions | Lista instituições (protegida: Admin, com paginação e filtro por status) |
| POST | /institutions/:id/approve | Aprovar instituição (protegida: Admin) |
| POST | /institutions/:id/reject | Rejeitar instituição (protegida: Admin) |

### Candidaturas
| Método HTTP | URL | Descrição |
| ----------- | --- | --------- |
| POST | /applications | Criar candidatura (protegida: Aluno) |
| GET | /applications/me | Listar próprias candidaturas (protegida: Aluno, com paginação e filtros) |
| GET | /applications/institution | Listar candidaturas da instituição (protegida: Instituição, com paginação e filtros) |
| GET | /applications | Listar todas candidaturas (protegida: Admin, com paginação e filtros) |
| PATCH | /applications/:id/status | Alterar status da candidatura (protegida: Admin, Instituição) |

### Usuários
| Método HTTP | URL | Descrição |
| ----------- | --- | --------- |
| GET | /users/me | Obter próprio perfil (protegida: qualquer usuário autenticado) |
| PUT | /users/me | Atualizar próprio perfil (protegida: qualquer usuário autenticado) |
| DELETE | /users/me | Deletar própria conta (protegida: qualquer usuário autenticado) |
| GET | /users | Listar usuários (protegida: Admin, com paginação e filtros: role, email) |
| POST | /users | Criar usuário (protegida: Admin) |
| GET | /users/:id | Obter usuário por ID (protegida: Admin, Instituição) |
| PUT | /users/:id | Atualizar usuário (protegida: Admin) |
| DELETE | /users/:id | Deletar usuário (protegida: Admin) |

### Recursos com Paginação
- ✅ `GET /opportunities` - Paginação: `?page=&limit=`
- ✅ `GET /users` - Paginação: `?page=&limit=`
- ✅ `GET /institutions` - Paginação: `?page=&limit=`
- ✅ `GET /applications` - Paginação: `?page=&limit=`
- ✅ `GET /applications/me` - Paginação: `?page=&limit=`
- ✅ `GET /applications/institution` - Paginação: `?page=&limit=`

### Recursos com Filtragem
- ✅ `GET /opportunities` - Filtros: `?category=&city=&institutionId=&isActive=`
- ✅ `GET /users` - Filtros: `?role=&email=`
- ✅ `GET /institutions` - Filtros: `?status=`
- ✅ `GET /applications` - Filtros: `?status=&opportunityId=&studentId=`
