import {usePageTitle} from "../../context/PageTitleContext.jsx";
import {useEffect, useState} from "react";
import styles from './history.module.scss'
import HistoryCard from "../../components/HistoryCard/HistoryCard";
import HistoryFilter from "../../components/HistoryFilter/HistoryFilter";

export default function History() {
    const {setTitle} = usePageTitle();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('shipment_date');
    const [sortOrder, setSortOrder] = useState('DESC');

    useEffect(() => {
        setTitle('История заказов')
    }, [])

    const fetchOrders = async (sortField = 'shipment_date', order = 'DESC') => {
        try {
            setLoading(true);
            
            const url = `https://sergo.kurgasov.ru/api.php?action=getOrders&sortBy=${sortField}&sortOrder=${order}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                setOrders(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Ошибка при загрузке данных');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(sortBy, sortOrder);
    }, [sortBy, sortOrder]);

    const handleSortChange = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
    };

    if (loading) {
        return (
            <div className={styles.stock__wrap}>
                <div className={styles.loading}>Загрузка истории заказов...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.stock__wrap}>
                <div className={styles.error}>Ошибка: {error}</div>
            </div>
        );
    }

    return(
        <>
            <div className={styles.stock__wrap}>
                <div className={styles.history__table}>
                    <div className={styles.history__inner}>
                    <HistoryCard 
                        isHeader={true}
                        shipment_date={'Дата отгрузки'}
                        nomenclature={'Номенклатура'}
                        coating_type={'Тип покрытия'}
                        quantity={'Количество'}
                        cancellation_reason={'Причина отмены'}
                        series={'Серия'}
                        status={'Статус'}
                        client={'Клиент'}
                    />
                    
                    {orders.map((order, index) => (
                        <HistoryCard 
                            key={index}
                            shipment_date={order.shipment_date || 'Не указано'}
                            nomenclature={order.nomenclature || 'Не указано'}
                            coating_type={order.coating_type || 'Не указано'}
                            quantity={`${order.quantity || 0}`}
                            cancellation_reason={order.cancellation_reason || '-'}
                            series={order.series || 'Не указано'}
                            status={order.status || 'Не указано'}
                            client={order.client || 'Не указано'}
                        />
                    ))}
                    
                    {orders.length === 0 && (
                        <div className={styles.no_data}>Нет данных о заказах</div>
                    )}
                    </div>
                </div>
                <div>
                    <HistoryFilter 
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />
                </div>
            </div>
        </>
    )
}