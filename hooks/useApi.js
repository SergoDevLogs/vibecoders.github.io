// hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(action, searchQuery = '', sortBy = '', sortOrder = 'ASC') {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortOrder) params.append('sortOrder', sortOrder);
                
                const url = `https://sergo.kurgasov.ru/api.php?action=${action}&${params.toString()}`;
                
                const response = await fetch(url);
                const result = await response.json();
                
                if (result.success) {
                    setData(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [action, searchQuery, sortBy, sortOrder]);

    return { data, loading, error };
}