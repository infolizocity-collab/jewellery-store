import API from "./api";

export const login = async (email: string, password: string) => {
  const { data } = await API.post("/api/login", { email, password });
  return data;
};

export const register = async (name: string, email: string, password: string) => {
  const { data } = await API.post("/api/register", { name, email, password });
  return data;
};