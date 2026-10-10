// Auth API with Mock Fallback for ShopSmart AI Frontend

const API_BASE = 'http://localhost:8080/api';

// In-memory mock database of registered users for fallback
const mockUsers = [
  {
    name: 'Demo User',
    email: 'demo@shopsmart.com',
    passwordHash: 'Demo@1234', // Only used in mock validation comparison
    membershipTier: 'PRIME'
  }
];

/**
 * Helper to get Bearer Authorization header for authenticated API calls
 */
export function authHeader() {
  try {
    const token = sessionStorage.getItem('shopsmart_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

/**
 * Login function: sends request to Spring Boot backend /api/auth/login.
 * Falls back to mock if backend is unreachable or unavailable.
 */
export async function loginApi(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data; // { token, user: { name, email, membershipTier } }
    } else if (response.status === 401) {
      const error = new Error('Incorrect email or password');
      error.status = 401;
      throw error;
    }
  } catch (err) {
    if (err.status === 401) throw err;
    // Fall back to Mock validation if network fails or endpoint doesn't exist
  }

  // --- MOCK FALLBACK ---
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!existingUser || existingUser.passwordHash !== password) {
    const error = new Error('Incorrect email or password');
    error.status = 401;
    throw error;
  }

  const fakeToken = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  return {
    token: fakeToken,
    user: {
      name: existingUser.name,
      email: existingUser.email,
      membershipTier: existingUser.membershipTier || 'BASIC'
    }
  };
}

/**
 * Register function: sends request to Spring Boot backend /api/auth/register.
 * Falls back to mock if backend is unreachable or unavailable.
 */
export async function registerApi(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmedName, email: normalizedEmail, password }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 409) {
      const error = new Error('An account with this email already exists');
      error.status = 409;
      throw error;
    }
  } catch (err) {
    if (err.status === 409) throw err;
    // Fall back to Mock
  }

  // --- MOCK FALLBACK ---
  const alreadyExists = mockUsers.some(u => u.email.toLowerCase() === normalizedEmail);
  if (alreadyExists) {
    const error = new Error('An account with this email already exists');
    error.status = 409;
    throw error;
  }

  const newUser = {
    name: trimmedName,
    email: normalizedEmail,
    passwordHash: password,
    membershipTier: 'BASIC'
  };
  mockUsers.push(newUser);

  const fakeToken = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  return {
    token: fakeToken,
    user: {
      name: newUser.name,
      email: newUser.email,
      membershipTier: newUser.membershipTier
    }
  };
}
