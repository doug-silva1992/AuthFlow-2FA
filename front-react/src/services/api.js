const BASE = '/api';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const message = data?.message || `Erro ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function registerUser({ client_name, email, senha, fk_IdentityProvider }) {
  const res = await fetch(`${BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_name, email, senha, fk_IdentityProvider }),
  });
  return handleResponse(res);
}

export async function requestAuthenticatorKey(user_id) {
  const res = await fetch(`${BASE}/authenticator/request_key?user_id=${user_id}`);
  return handleResponse(res);
}

export async function verifyCode({ user_id, code }) {
  const res = await fetch(`${BASE}/authenticator/verify_code?user_id=${user_id}&code=${code}`);
  return handleResponse(res);
}

export async function identity_provider() {
  const res = await fetch(`${BASE}/identity_provider`);
  return handleResponse(res);
}
