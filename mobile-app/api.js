  const API_URL = "http://localhost:8080";
    // Create User
  export async function createUser(email, phoneNumber, password) {
    const res = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(email)}&phoneNumber=${encodeURIComponent(phoneNumber)}&password=${encodeURIComponent(password)}`,
      { method: 'POST' }
    );
    if (!res.ok) throw new Error('Failed to create user');
    return res.json(); // { id, email, phoneNumber, passwordHash }
  }

  // Login
  export async function login(email, password) {
    const res = await fetch(
      `${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      { method: 'POST' }
    );
    if (res.status === 401) throw new Error('Invalid email or password');
    if (!res.ok) throw new Error('Login failed');
    return res.json(); // { id, email, phoneNumber, passwordHash }
  }

  // Get User by ID
  export async function getUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`);
    if (!res.ok) throw new Error('User not found');
    return res.json(); // { id, email, phoneNumber, passwordHash }
  }

  
  // Sign up
  const user = await createUser('sean@example.com', '555-1234', 'mypassword');
  console.log(user.id); // store this

  // Login
  const user = await login('sean@example.com', 'mypassword');
  console.log(user.id); // store this