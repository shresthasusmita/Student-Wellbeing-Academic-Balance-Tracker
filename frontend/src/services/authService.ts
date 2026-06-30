import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Sends user credentials to the backend to authenticate
 */
export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data; // will return { success: true, token: "eyJhb..." }
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
/**
 * Fetches the authenticated user's metadata
 */
export async function fetchUserProfile() {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return response.data;
}

/**
 * Completely purges the session from local device memory
 */
export async function secureLogout() {
  await AsyncStorage.removeItem("token");
}