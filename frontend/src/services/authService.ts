import api from "./api";

/**
 * Sends user credentials to the backend to authenticate
 */
export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data; // This will return { success: true, token: "eyJhb..." }
}

/**
 * Sends a registration request for a new student profile
 */
export async function register(name: string, email: string, password: string) {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
}