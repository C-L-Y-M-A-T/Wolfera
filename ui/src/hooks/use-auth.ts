import { useAuthContext } from "@/context/auth-context";

export const useAuth = () => {
  const { user, loading } = useAuthContext();
  return { user, loading };
};
