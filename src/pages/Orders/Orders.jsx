import {usePageTitle} from "../../context/PageTitleContext.jsx";
import {useEffect, useState, useRef} from "react";
import OrderCardSmall from "../../components/OrderCardSmall/OrderCardSmall";
import OrderBlock from "../../components/OrderBlock/OrderBlock";
import UiButton from "../../uiKit/UiButton/UiButton.jsx";
import DateSearch from "../../components/DateSearch/DateSearch";
import Navbar from "../../components/MainLayout/Navbar";
import styles from './Order.module.scss';

export default function Orders() {
    const {setTitle} = usePageTitle()
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const scrollContainerRef = useRef(null);
    const INITIAL_COUNT = 10;
    const LOAD_MORE_COUNT = 20;

    useEffect(() => {
        setTitle('Заказы')
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true);
            
            const url = `https://sergo.kurgasov.ru/api.php?action=getOrders&sortBy=shipment_date&sortOrder=DESC`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                const ordersData = result.data;
                setOrders(ordersData);
                setFilteredOrders(ordersData);
                setDisplayedOrders(ordersData.slice(0, INITIAL_COUNT));
                setVisibleCount(INITIAL_COUNT);
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
        fetchOrders();
    }, []);
    useEffect(() => {
        setDisplayedOrders(filteredOrders.slice(0, visibleCount));
    }, [filteredOrders, visibleCount]);

    const parseDate = (dateString) => {
        if (!dateString) return null;
        
        try {
            const cleanDateString = dateString.replace('Дата отгрузки: ', '');
            
            const [datePart, timePart] = cleanDateString.split(' ');
            const [day, month, year] = datePart.split('.');
            
            return new Date(year, month - 1, day);
        } catch (error) {
            console.error('Error parsing date:', dateString, error);
            return null;
        }
    };

    const filterOrdersByDateAndNumber = (startDate, endDate, orderNumber) => {
        if (!startDate && !endDate && !orderNumber) {
            setFilteredOrders(orders);
            setDisplayedOrders(orders.slice(0, visibleCount));
            setFilters({ startDate, endDate, orderNumber });
            return;
        }

        const filtered = orders.filter((order, index) => {
            if (orderNumber) {
                const searchNumber = orderNumber.trim();
                const orderNum = (orders.length - index).toString();
                
                if (orderNum !== searchNumber) {
                    return false;
                }
            }

            if (startDate || endDate) {
                const orderDate = parseDate(order.shipment_date);
                if (!orderDate) return false;

                let matchesStart = true;
                let matchesEnd = true;

                if (startDate) {
                    matchesStart = orderDate >= startDate;
                }

                if (endDate) {
                    const endOfDay = new Date(endDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    matchesEnd = orderDate <= endOfDay;
                }

                if (!matchesStart || !matchesEnd) {
                    return false;
                }
            }

            return true;
        });

        setFilteredOrders(filtered);
        setVisibleCount(INITIAL_COUNT);
        setFilters({ startDate, endDate, orderNumber });
    };

    const resetDateFilter = () => {
        setFilteredOrders(orders);
        setVisibleCount(INITIAL_COUNT);
        setFilters({});
    };

    const handleLoadMore = () => {
        const newVisibleCount = visibleCount + LOAD_MORE_COUNT;
        setVisibleCount(newVisibleCount);
        setTimeout(() => {
            if (scrollContainerRef.current) {
                const scrollContainer = scrollContainerRef.current;
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }, 100);
    };

    const handleExpand = (index) => {
        setExpandedOrderId(index);
    };

    const handleCollapse = () => {
        setExpandedOrderId(null);
    };

    const handleOrderCreated = async (orderId) => {
        setSuccessMessage(`Заказ #${orderId} успешно создан и отправлен на рассмотрение!`);
        setShowSuccessMessage(true);

        await fetchOrders();

        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 5000);
    };

    const getOrderStats = () => {
        const total = filteredOrders.length;
        const shipped = filteredOrders.filter(order => order.status === 'Отгружено').length;
        const readyNotShipped = filteredOrders.filter(order => order.status === 'Готово но не отгружено').length;
        const inProduction = filteredOrders.filter(order => order.status === 'В производстве').length;
        const canceled = filteredOrders.filter(order => order.status === 'Отменено').length;

        return {
            total,
            shipped,
            readyNotShipped,
            inProduction,
            canceled
        };
    };

    const hasMoreOrders = displayedOrders.length < filteredOrders.length;

    if (loading) {
        return (
            <div className={styles.orders__wrapper}>
                <div className={styles.loading}>Загрузка заказов...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.orders__wrapper}>
                <div className={styles.error}>Ошибка: {error}</div>
            </div>
        );
    }

    const stats = getOrderStats();

    return(
        <>
            <div className={`${styles.orders__wrapper} ${expandedOrderId !== null ? styles.noScroll : ''}`}>
                <div className={styles.orders__scrollbar} ref={scrollContainerRef}>
                    {showSuccessMessage && (
                        <div className={styles.successMessage}>
                            {successMessage}
                        </div>
                    )}

                    <DateSearch 
                        onFilter={filterOrdersByDateAndNumber}
                        onReset={resetDateFilter}
                        resultCount={filteredOrders.length}
                        totalCount={orders.length}
                    />
                    
                    <div className={styles.cards__wrapper}>
                        {displayedOrders.map((order, index) => (
                            <OrderCardSmall 
                                key={index}
                                orderNumber={filteredOrders.length - index}
                                status={order.status}
                                shipmentDate={order.shipment_date}
                                productName={order.nomenclature}
                                orderData={order}
                                isExpanded={expandedOrderId === index}
                                onExpand={() => handleExpand(index)}
                                onCollapse={handleCollapse}
                            />
                        ))}
                        
                        {displayedOrders.length === 0 && (
                            <div className={styles.noData}>
                                {orders.length === 0 ? 'Нет данных о заказах' : 'Заказы не найдены по выбранным критериям'}
                            </div>
                        )}
                    </div>

                    {hasMoreOrders && (
                        <div className={styles.loadMoreContainer}>
                            <UiButton 
                                onClick={handleLoadMore}
                                classList={styles.btnOrdersMore}
                            >
                                Загрузить ещё ({filteredOrders.length - displayedOrders.length} из {filteredOrders.length})
                            </UiButton>
                        </div>
                    )}

                    {!hasMoreOrders && filteredOrders.length > 0 && (
                        <div className={styles.allLoadedMessage}>
                            Все заказы загружены ({filteredOrders.length})
                        </div>
                    )}
                </div>
                <OrderBlock stats={stats} orders={filteredOrders} filters={filters}/>
            </div>
        </>
    )
}