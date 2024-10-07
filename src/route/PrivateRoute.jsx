import { useContext, useEffect, useState } from "react";
import { getAccountAPI } from "../services/service.auth";
import { AuthContext } from "../component/context/auth.context";
import { Navigate } from "react-router-dom";
import Loading from "../page/common/Loading";

const PrivateRoute = ({ children }) => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUserInfo = async () => {
        try {
            const response = await getAccountAPI();
            setUser({
                id: response.data.id,
                role: response.data.role,
            });
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchUserInfo();
        } else {
            setLoading(false);
        }
    }, [setUser]);

    if (loading) {
        return <Loading />;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return <Navigate to="/pms/auth/login" replace />;
}

export default PrivateRoute;