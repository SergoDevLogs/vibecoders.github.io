import styles from './OrderBlock.module.scss'
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function OrderBlock({ stats, orders, filters }) {
    const [consumptionData, setConsumptionData] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCharts, setShowCharts] = useState(true);

    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
        '#D7BDE2', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE',
        '#85C1E9', '#F8C471', '#F1948A', '#A9DFBF', '#82CA9D'
    ];

    useEffect(() => {
        const shouldShowCharts = checkIfChartsShouldShow();
        setShowCharts(shouldShowCharts);

        if (shouldShowCharts && orders && orders.length > 0) {
            processChartData();
        } else {
            setConsumptionData([]);
            setPopularProducts([]);
        }
    }, [orders, filters]);

    const checkIfChartsShouldShow = () => {
        if (filters?.orderNumber) {
            return false;
        }
        return true;
    };

    const processChartData = () => {
        setLoading(true);
        
        try {
            const monthlyData = {};
            let filteredOrders = orders;

            if (filters?.startDate || filters?.endDate) {
                filteredOrders = orders.filter(order => {
                    if (!order.shipment_date) return false;
                    
                    try {
                        const dateStr = order.shipment_date.replace('Дата отгрузки: ', '');
                        const [datePart] = dateStr.split(' ');
                        const [day, month, year] = datePart.split('.');
                        const orderDate = new Date(year, month - 1, day);
                        
                        let matchesStart = true;
                        let matchesEnd = true;

                        if (filters.startDate) {
                            matchesStart = orderDate >= filters.startDate;
                        }

                        if (filters.endDate) {
                            const endOfDay = new Date(filters.endDate);
                            endOfDay.setHours(23, 59, 59, 999);
                            matchesEnd = orderDate <= endOfDay;
                        }

                        return matchesStart && matchesEnd;
                    } catch (e) {
                        return false;
                    }
                });
            }
            filteredOrders.forEach(order => {
                if (order.shipment_date && order.status === 'Отгружено') {
                    try {
                        const dateStr = order.shipment_date.replace('Дата отгрузки: ', '');
                        const [datePart] = dateStr.split(' ');
                        const [day, month, year] = datePart.split('.');
                        const date = new Date(year, month - 1, day);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        const monthName = date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
                        
                        if (!monthlyData[monthKey]) {
                            monthlyData[monthKey] = {
                                month: monthName,
                                completedOrders: 0
                            };
                        }
                        
                        monthlyData[monthKey].completedOrders += 1;
                    } catch (e) {
                        console.log('Error parsing date:', order.shipment_date);
                    }
                }
            });
            
            const consumptionData = Object.values(monthlyData)
                .sort((a, b) => a.month.localeCompare(b.month))
                .slice(-12);
            const productCount = {};
            
            filteredOrders.forEach(order => {
                if (order.nomenclature && order.nomenclature !== 'Не указано') {
                    const productName = order.nomenclature;
                    productCount[productName] = (productCount[productName] || 0) + 1;
                }
            });
            
            const popularProducts = Object.entries(productCount)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 6);
            
            setConsumptionData(consumptionData);
            setPopularProducts(popularProducts);
            
        } catch (error) {
            console.error('Error processing chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    const { total, shipped, readyNotShipped, inProduction, canceled } = stats;
    const getChartSubtitle = () => {
        if (filters?.startDate && filters?.endDate) {
            const start = filters.startDate.toLocaleDateString('ru-RU');
            const end = filters.endDate.toLocaleDateString('ru-RU');
            return `Период: ${start} - ${end}`;
        } else if (filters?.startDate) {
            const start = filters.startDate.toLocaleDateString('ru-RU');
            return `С ${start}`;
        } else if (filters?.endDate) {
            const end = filters.endDate.toLocaleDateString('ru-RU');
            return `По ${end}`;
        }
        return 'Последние 12 месяцев';
    };

    return (
        <>
            <div className={styles.block__wrap}>
                <p className={styles.stat}>Статистика</p>
                <div className={styles.count}>Всего заказов - {total}</div>
                <div className={styles.stat__wrap}>
                    <div className={styles.stat__el}>
                        <p className={styles.done}>Отгружено</p>
                        <p>{shipped}</p>
                    </div>
                    <div className={styles.stat__el}>
                        <p className={styles.not__ready}>Готово, но не отгружено</p>
                        <p>{readyNotShipped}</p>
                    </div>
                    <div className={styles.stat__el}>
                        <p className={styles.in__process}>В производстве</p>
                        <p>{inProduction}</p>
                    </div>
                    <div className={styles.stat__el}>
                        <p className={styles.canceled}>Отменено</p>
                        <p>{canceled}</p>
                    </div>
                </div>

                {showCharts && consumptionData.length > 0 && (
                    <div className={styles.chart__container}>
                        <h3 className={styles.chart__title}>Отгруженные заказы по месяцам</h3>
                        <div className={styles.chart__subtitle}>{getChartSubtitle()}</div>
                        <div className={styles.chart__wrapper}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart 
                                    data={consumptionData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis 
                                        dataKey="month" 
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        interval={0}
                                        stroke="#ccc"
                                    />
                                    <YAxis stroke="#ccc" />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#333',
                                            border: '1px solid #555',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="completedOrders" 
                                        fill="#4CAF50" 
                                        name="Отгруженные заказы"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {showCharts && popularProducts.length > 0 && (
                    <div className={styles.chart__container}>
                        <h3 className={styles.chart__title}>Самые популярные товары</h3>
                        <div className={styles.chart__subtitle}>{getChartSubtitle()}</div>
                        <div className={styles.pie__wrapper}>
                            <div className={styles.pie__chart}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={popularProducts}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={70}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ value }) => value}
                                        >
                                            {popularProducts.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value) => [`${value} заказов`, 'Количество']}
                                            contentStyle={{ 
                                                backgroundColor: '#333',
                                                border: '1px solid #555',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.pie__legend}>
                                {popularProducts.map((item, index) => (
                                    <div key={index} className={styles.legend__item}>
                                        <div 
                                            className={styles.legend__color} 
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className={styles.legend__text}>
                                            {item.name}
                                        </span>
                                        <span className={styles.legend__value}>({item.value})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {showCharts && loading && <div className={styles.loading}>Загрузка графиков...</div>}
                
                {showCharts && !loading && consumptionData.length === 0 && popularProducts.length === 0 && (
                    <div className={styles.no_data}>Недостаточно данных для построения графиков</div>
                )}

                {!showCharts && (
                    <div className={styles.no_charts_message}>
                        Графики недоступны при поиске по номеру заказа
                    </div>
                )}
            </div>
        </>
    )
}