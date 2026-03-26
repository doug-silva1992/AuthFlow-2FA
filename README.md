# AuthFlow-2FA

Sistema de autenticação com **dois fatores (2FA)** via TOTP (Time-based One-Time Password), compatível com Microsoft Authenticator e Google Authenticator.

---

## Visão Geral

O fluxo de autenticação consiste em três etapas:

1. **Cadastro** — o usuário cria uma conta com nome, e-mail e senha
2. **QR Code / Secret 2FA** — um secret TOTP é gerado e exibido como QR Code para o usuário escanear no aplicativo autenticador
3. **Verificação** — o usuário insere o código de 6 dígitos gerado pelo app para confirmar a identidade

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Backend | PHP 8.2, Laravel Lumen 10 |
| 2FA TOTP | `spomky-labs/otphp` ^11.4 |
| Documentação API | `zircote/swagger-php` ^4.10 |
| Frontend | React + Vite |
| UI | Componentes React com CSS customizado |
| Banco de dados | MySQL 8.0 |
| Infraestrutura | Docker + Docker Compose |
| Servidor web | Apache 2 (`php:8.2-apache`) |

---

## Estrutura do Projeto

```
AuthFlow-2FA/
├── docker-compose.yml
├── Dockerfile
├── php-api/                        # Backend Laravel Lumen
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── UserController.php
│   │   │   └── AuthenticatorController.php
│   │   ├── Models/
│   │   │   ├── usuariosModel.php
│   │   │   └── IdentityProviderModel.php
│   │   ├── OpenApi.php
│   │   └── OpenApiSpec.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── web.php
└── front-react/                    # Frontend React + Vite
    └── src/
        ├── App.jsx
        └── pages/
            ├── Register.jsx
            ├── Login.jsx
            ├── QRCode.jsx
            └── Success.jsx
```

---

## Infraestrutura Docker

O projeto sobe dois containers via `docker-compose.yml`:

| Container | Imagem | Porta | Descrição |
|---|---|---|---|
| `authflow-2fa` | PHP 8.2 + Apache (Dockerfile local) | `8080:80` | API Laravel Lumen |
| `authflow-mysql` | `mysql:8.0` | `3306:3306` | Banco de dados MySQL |

**Variáveis de ambiente da API:**

| Variável | Valor |
|---|---|
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `mysql` |
| `DB_DATABASE` | `authflow` |
| `DB_USERNAME` | `authflow_user` |
| `DB_PASSWORD` | `authflow_pass` |

---

## Como Rodar

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados

### Subir os containers

```bash
docker-compose up --build -d
```

### Rodar as migrations

```bash
docker exec -it authflow-2fa php artisan migrate --seed
```

A API estará disponível em `http://localhost:8080`.  
O frontend estará disponível em `http://localhost:5173` (via `npm run dev` dentro de `front-react/`).

---

## Banco de Dados

### Tabela `IdentityProvider`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `bigint PK` | Identificador |
| `provider_name` | `varchar unique` | Nome do provedor (`microsoft`, `google`) |
| `timestamps` | — | `created_at`, `updated_at` |

Seed inicial: registros para `microsoft` e `google`.

### Tabela `usuarios`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `bigint PK` | Identificador |
| `nome` | `varchar` | Nome do usuário |
| `email` | `varchar unique` | E-mail |
| `senha` | `varchar` | Senha com hash BCrypt |
| `fk_IdentityProvider` | `bigint FK nullable` | Provedor 2FA vinculado |
| `secret_2fa` | `varchar nullable` | Secret TOTP do usuário |
| `is_2fa_enabled` | `boolean` | Se o 2FA está ativo (padrão: `false`) |
| `timestamps` | — | `created_at`, `updated_at` |

---

## API — Endpoints

### `GET /`

Retorna a versão do Lumen.

---

### `POST /users/register`

Cadastra um novo usuário.

**Body (JSON):**

```json
{
  "client_name": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "minhasenha123",
  "fk_IdentityProvider": 1
}
```

**Resposta 201:**

```json
{
  "user_id": 1
}
```

**Validações:**
- `client_name` — obrigatório
- `email` — obrigatório, formato válido, único na tabela
- `senha` — obrigatório, mínimo 8 caracteres

### `GET /identity_provider`

Retorna a lista de provedores de autenticação disponíveis para popular o select do cadastro.

---

### `GET /authenticator/verify_code`

Verifica o código TOTP informado pelo usuário. *(Em desenvolvimento)*

---

### `GET /swagger`

Interface Swagger UI com a documentação interativa da API.

### `GET /openapi.json`

Especificação OpenAPI 3.0 em formato JSON, gerada automaticamente via `swagger-php`.

---

## Frontend

O frontend usa navegação baseada em estado (`useState`) sem roteador externo.

| Página | Estado | Descrição |
|---|---|---|
| Register | `register` | Formulário de cadastro com validação client-side |
| Login | `login` | Formulário de login |
| QRCode | `qrcode` | Exibe QR Code para configurar o app autenticador, timer TOTP de 30s e verificação do código |
| Success | `success` | Confirmação de acesso autenticado com animação de confetti |

### Setup e Desenvolvimento

```bash
cd front-react
npm install
npm run dev
```

O frontend rodará em `http://localhost:5173`.

**Proxy Vite → Backend:** O arquivo `vite.config.js` configura um proxy que redireciona todas as requisições `/api/*` para `http://localhost:8080`.

### Serviço de API (`src/services/api.js`)

O projeto utiliza um serviço centralizado para chamadas HTTP:

```javascript
import { registerUser, requestAuthenticatorKey, verifyCode } from '@/services/api';

// Registrar novo usuário
await registerUser({
  client_name: 'João Silva',
  email: 'joao@exemplo.com',
  senha: 'senha123',
  fk_IdentityProvider: 1  // ID do provedor (1=Microsoft, 2=Google)
});

// Solicitar chave TOTP e QR Code
const response = await requestAuthenticatorKey(userId);
const { uri, secret } = response; // uri para QR Code, secret para backup

// Verificar código TOTP
await verifyCode({ user_id: userId, code: '123456' });
```

**Base URL:** `/api` → redirecionada para `http://localhost:8080`

### Fluxo atual do cadastro no frontend

- A tela de Register busca provedores dinamicamente por `GET /identity_provider`.
- O campo "Tipo de autenticador" é um select obrigatório.
- Ao submeter, o frontend chama `POST /users/register`.
- Em caso de sucesso, o frontend salva dados básicos no localStorage para seguir para a tela de QR Code.

---

## Status de Implementação

### Concluído

- [x] Docker Compose com API PHP + MySQL
- [x] Dockerfile com PHP 8.2, Apache, extensões PDO e Composer
- [x] Migrations das tabelas `usuarios` e `IdentityProvider` com relacionamento FK
- [x] Seed inicial dos provedores de identidade (microsoft, google)
- [x] `POST /users/register` funcional com validação e hash BCrypt
- [x] Integração da biblioteca TOTP (`spomky-labs/otphp`) no backend
- [x] Swagger UI em `/swagger` e spec em `/openapi.json`
- [x] 4 páginas React com dark theme, animações e componentes MUI
- [x] Proxy Vite configurado para redirecionar `/api` → backend
- [x] Serviço centralizado de API (`src/services/api.js`)
- [x] `GET /authenticator/request_key` — gerar e retornar secret TOTP + URI QR Code
- [x] Registro no frontend integrado ao backend (`POST /users/register`)
- [x] Select de provedor 2FA carregado de `GET /identity_provider`

### Em Desenvolvimento

- [ ] `GET /authenticator/verify_code` — verificar o código TOTP
- [ ] Persistir secret TOTP no banco de dados
- [ ] Login com verificação real de senha (hash BCrypt)
- [ ] Proteção de rotas com middleware de autenticação
- [ ] Integração com Microsoft Authenticator e Google Authenticator
- [ ] Testes unitários e E2E
- [ ] Remover truncamento de usuários no endpoint de cadastro para permitir múltiplos registros

---

## Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT).