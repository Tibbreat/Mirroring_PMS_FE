import { useContext, useEffect, useState } from "react";
import { getAccountAPI } from "../services/service.auth";
import { AuthContext } from "../component/context/auth.context";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../page/common/Loading";

const PrivateRoute = ({ role, children }) => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        try {
            const response = await getAccountAPI();
            setUser(response.data);
            console.log("User info:", response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            navigate("/pms/auth/login");
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

    if (!isAuthenticated) {
        return <Navigate to="/pms/auth/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
