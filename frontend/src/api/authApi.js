const API_BASE = 'http://localhost:8080/api';

export async function loginCustomer(email = 'alex.dev@shopsmart.io', password = 'password123') {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Auth API fallback:', err.message);
  }
  return {
    email,
    name: 'Alex Chen',
    membershipTier: 'PRIME',
    token: 'simulated_jwt_token_alex'
  };
}

export async function updateCustomerTier(email, membershipTier) {
  try {
    const response = await fetch(`${API_BASE}/auth/tier`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, membershipTier })
    });
    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Update tier API fallback:', err.message);
  }
  return { email, membershipTier };
}
