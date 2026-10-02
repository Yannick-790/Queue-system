import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {


  const {
    user,
    loading
  } = useAuth();


  // ADD THIS HERE
  console.log("PROTECTED ROUTE:", {
    user,
    role: user?.role,
    allowedRoles: roles,
  });



  if (loading) {

    return <p>Loading...</p>;

  }



  if (!user) {

    return <Navigate to="/login" />;

  }



  if (
    roles &&
    !roles.includes(user.role)
  ) {

    return <Navigate to="/" />;

  }



  return children;

}