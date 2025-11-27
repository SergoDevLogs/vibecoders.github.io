import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        checkAuthentication();
    }, [location]);

    const checkAuthentication = () => {
        const auth = localStorage.getItem('authenticated');
        const user = localStorage.getItem('user');
        
        if (auth === 'true' && user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    if (isAuthenticated === null) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                color: 'white',
                fontSize: '18px'
            }}>
                Проверка авторизации...
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/auth" state={{ from: location }} replace />;
}