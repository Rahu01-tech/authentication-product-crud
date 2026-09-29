import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
    const { accessToken, loading } = useAuth();

    if (loading) {
        return <h1>Checking authentication...</h1>;
    }

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;