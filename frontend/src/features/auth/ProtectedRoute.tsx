import { Navigate } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { getUserRoles } from "../../utils/auth";

type Props = {
  children: React.ReactNode;
  requiredRole?: string;
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !getUserRoles().includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
