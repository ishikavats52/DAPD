// ─── API Layer – DAPD Backend ─────────────────────────────────────────────────
// Change this to your PC's local IP when testing on a real device
const BASE_URL = 'http://10.158.8.168:5000';

import { User } from '../navigation/types';

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerUser = async (
  name: string,
  email: string,
  mobile: string,
  officeName: string,
  address: string,
  password: string,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      mobile,
      office_name: officeName,
      address,
      password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed.');
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginUser = async (
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed.');
  return data as { user: User; token: string };
};
