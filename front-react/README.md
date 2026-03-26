# AuthFlow 2FA - Frontend

Frontend React + Vite para o sistema de autenticação com dois fatores (2FA) via TOTP.

## Setup & Desenvolvimento

### Instalar dependências

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> **Nota:** O backend (API Laravel Lumen) precisa estar rodando em `http://localhost:8080` para as chamadas de API funcionarem.

### Build para produção

```bash
npm run build
```

### Lint

```bash
npm lint
```

---

## Arquitetura

### Proxy Vite

O arquivo `vite.config.js` configura um proxy que redireciona todas as requisições `/api/*` para o backend:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

### Serviço de API (`src/services/api.js`)

Centraliza todas as chamadas HTTP para a API:

```javascript
import { registerUser, requestAuthenticatorKey, verifyCode } from '@/services/api';

// Registrar novo usuário
const response = await registerUser({
  client_name: 'João Silva',
  email: 'joao@exemplo.com',
  senha: 'senha123',
  fk_IdentityProvider: 1
});

// Gerar chave TOTP e QR Code
const { uri, secret } = await requestAuthenticatorKey(1);

// Verificar código TOTP
await verifyCode({ user_id: 1, code: '123456' });
```

**Tratamento de erros:** Todas as funções lançam exceções com mensagens de erro do backend.

### Páginas

- **Register.jsx** — Formulário de cadastro → chama `registerUser()`
- **Login.jsx** — Formulário de login (em desenvolvimento)
- **QRCode.jsx** — Exibe QR Code TOTP → chama `requestAuthenticatorKey()`
- **Success.jsx** — Confirmação de sucesso

### Stack

- React 19
- Vite 6
- Material UI (MUI) v7
- Emotion (CSS-in-JS)
- React Router DOM 7
