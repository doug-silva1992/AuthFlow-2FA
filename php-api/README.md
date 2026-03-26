# AuthFlow 2FA - Backend API

API Laravel Lumen para autenticação com dois fatores (2FA) via TOTP.

## Setup & Desenvolvimento

### Pré-requisitos

- Docker + Docker Compose
- PHP 8.2 (para desenvolvimento local, opcional)
- Composer (para desenvolvimento local, opcional)

### Rodar com Docker

```bash
# Na raiz do projeto
docker-compose up --build -d

# Rodar migrations
docker exec -it authflow-2fa php artisan migrate --seed
```

A API estará disponível em `http://localhost:8080`.

### Rodar localmente (sem Docker)

```bash
# Instalar dependências
composer install

# Configurar .env
cp .env.example .env
php artisan key:generate

# Criar banco de dados e rodar migrations
php artisan migrate --seed

# Rodar servidor local
php artisan serve
```

---

## Endpoints

### `GET /`

Retorna a versão do Lumen.

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

**Respostas:**

- **201 Created:**
  ```json
  {
    "message": "Usuário registrado com sucesso",
    "user_id": 1
  }
  ```

- **422 Unprocessable Entity:**
  ```json
  {
    "message": "Dados de entrada inválidos",
    "errors": {
      "email": ["The email has already been taken."]
    }
  }
  ```

**Validações:**
- `client_name` — obrigatório
- `email` — obrigatório, válido, único
- `senha` — obrigatório, mínimo 8 caracteres
- `fk_IdentityProvider` — obrigatório (1=Microsoft, 2=Google)

### `GET /authenticator/request_key`

Gera chave TOTP e retorna a URI do QR Code para o usuário configurar no app autenticador.

**Query Params:**

```
?user_id=1
```

**Resposta 200:**

```json
{
  "message": "Chave gerada com sucesso",
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "uri": "otpauth://totp/DCRM:joao@exemplo.com?secret=JBSWY3DPEBLW64TMMQ======&issuer=DCRM"
}
```

**Respostas de erro:**

- **404 Not Found:**
  ```json
  {
    "message": "Usuário não encontrado"
  }
  ```

- **400 Bad Request:**
  ```json
  {
    "message": "Provedor de autenticação não suportado"
  }
  ```

### `GET /authenticator/verify_code`

Verifica o código TOTP informado pelo usuário.

**Query Params:**

```
?user_id=1&code=123456
```

**Resposta 200:**

```json
{
  "message": "Código verificado com sucesso"
}
```

### `GET /swagger`

Interface **Swagger UI** com documentação interativa.

Acesse: `http://localhost:8080/swagger`

### `GET /openapi.json`

Especificação **OpenAPI 3.0** em JSON, gerada automaticamente.

---

## Banco de Dados

### Tabela `usuarios`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigint PK | Identificador |
| `nome` | varchar | Nome do usuário |
| `email` | varchar unique | E-mail |
| `senha` | varchar | Senha com hash BCrypt |
| `fk_IdentityProvider` | bigint FK | Provedor 2FA (Microsoft/Google) |
| `secret_2fa` | varchar nullable | Secret TOTP do usuário |
| `is_2fa_enabled` | boolean | Se 2FA está ativo |
| `created_at` | timestamp | — |
| `updated_at` | timestamp | — |

### Tabela `IdentityProvider`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | bigint PK | Identificador |
| `provider_name` | varchar unique | Nome do provedor (`microsoft`, `google`) |
| `created_at` | timestamp | — |
| `updated_at` | timestamp | — |

**Seed inicial:**
- ID 1: `microsoft`
- ID 2: `google`

---

## Stack

- **Framework:** Laravel Lumen 10
- **PHP:** 8.2
- **Servidor:** Apache
- **Banco:** MySQL 8.0
- **TOTP:** `spomky-labs/otphp` ^11.4
- **Documentação:** `zircote/swagger-php` ^4.10

---

## Estrutura do Código

```
app/
├── Http/
│   └── Controllers/
│       ├── UserController.php          # Registrar usuários
│       └── AuthenticatorController.php # TOTP e verificação
├── Models/
│   ├── usuariosModel.php
│   └── IdentityProviderModel.php
├── OpenApi.php
└── OpenApiSpec.php
database/
├── migrations/
│   ├── 2026_03_20_000000_create_usuarios_table.php
│   └── 2026_03_20_213717_create__identity_provider_table.php
└── seeders/
    └── DatabaseSeeder.php
routes/
└── web.php
```
