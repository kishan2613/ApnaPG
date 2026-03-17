import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ currUser, children }) => {
  if (!currUser) {
    // if no user, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
