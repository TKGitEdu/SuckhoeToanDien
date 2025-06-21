import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[]; // ['Admin', 'Doctor', 'Patient']
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken");
  const userInfo = localStorage.getItem("userInfo");

  if (!token || !userInfo) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userInfo);
  const userRole = user?.role?.roleName;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
