import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  username: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;

  const now = Date.now() / 1000;
  return decoded.exp > now;
};
