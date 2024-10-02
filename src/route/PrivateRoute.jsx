import { useContext, useEffect, useState } from "react";
import { getAccountAPI } from "../services/service.auth";
import { AuthContext } from "../component/context/auth.context";
import { Navigate } from "react-router-dom";

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
        return <div>Loading...</div>; // Hiển thị thông báo khi đang kiểm tra xác thực
    }

    if (isAuthenticated) {
        return <>{children}</>; // Nếu đã xác thực, hiển thị các component con
    }

    return <Navigate to="/pms/auth/login" replace />; // Nếu không xác thực, chuyển hướng đến trang đăng nhập
}

export default PrivateRoute;