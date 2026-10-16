import { createContext, useContext, type ReactNode } from "react";

export interface Auth {
  userId: string;
  role: "admin" | "member";
}

// null صادقانه — نه {} as Auth (فصل ۳۷)
const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ auth, children }: { auth: Auth; children: ReactNode }) {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error("useAuth فقط درون <AuthProvider> مجاز است");
  }
  return auth;
}
