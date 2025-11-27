import { useState, useEffect } from 'react';
import styles from './CreateOrderModal.module.scss';

export default function CreateOrderModal({ onClose, onOrderCreated }) {
    const [leftovers, setLeftovers] = useState([]);
    const [filteredLeftovers, setFilteredLeftovers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeftovers();
    }, []);

    useEffect(() => {
        filterLeftovers();
    }, [searchQuery, leftovers]);

    const fetchLeftovers = async () => {
        try {
            const response = await fetch('https://sergo.kurgasov.ru/api.php?action=getLeftovers');
            const result = await response.json();
            
            if (result.success) {
                setLeftovers(result.data);
                setFilteredLeftovers(result.data);
            } else {
                setError('Ошибка загрузки остатков');
            }
        } catch (error) {
            setError('Ошибка соединения с сервером');
            console.error('Error fetching leftovers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterLeftovers = () => {
        if (!searchQuery.trim()) {
            setFilteredLeftovers(leftovers);
            return;
        }

        const filtered = leftovers.filter(item => 
            item.num?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.client?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredLeftovers(filtered);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setError('');
    };

    const handleCreateOrder = async () => {
        if (!selectedProduct) {
            setError('Выберите товар для заказа');
            return;
        }

        if (!quantity || quantity <= 0) {
            setError('Введите корректное количество');
            return;
        }

        setCreating(true);
        setError('');

        try {
            const orderData = {
                nomenclature: selectedProduct.num,
                coating_type: selectedProduct.coating_type || '',
                quantity: parseFloat(quantity),
                series: selectedProduct.series || '',
                client: 'root'
            };

            const response = await fetch('https://sergo.kurgasov.ru/api.php?action=createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                onOrderCreated(result.orderId);
                onClose();
            } else {
                setError(result.error || 'Ошибка создания заказа');
            }
        } catch (error) {
            setError('Ошибка соединения с сервером');
            console.error('Error creating order:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setQuantity(value);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Создать заказ</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="Поиск по номенклатуре, серии, клиенту..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.productsList}>
                    {loading ? (
                        <div className={styles.loading}>Загрузка остатков...</div>
                    ) : filteredLeftovers.length === 0 ? (
                        <div className={styles.noResults}>Товары не найдены</div>
                    ) : (
                        <table className={styles.productsTable}>
                            <thead>
                                <tr>
                                    <th>Номенклатура</th>
                                    <th>Серия</th>
                                    <th>Тип покрытия</th>
                                    <th>Остаток</th>
                                    <th>Клиент</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeftovers.map((item, index) => (
                                    <tr 
                                        key={index}
                                        className={`${styles.productRow} ${
                                            selectedProduct === item ? styles.selected : ''
                                        }`}
                                        onClick={() => handleProductSelect(item)}
                                    >
                                        <td>{item.num || 'Не указано'}</td>
                                        <td>{item.series || 'Не указано'}</td>
                                        <td>{item.coating_type || 'Не указано'}</td>
                                        <td>{item.lefts || 0}</td>
                                        <td>{item.client || 'Не указано'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {selectedProduct && (
                    <div className={styles.orderDetails}>
                        <div className={styles.selectedProduct}>
                            <strong>Выбранный товар:</strong> {selectedProduct.num} - {selectedProduct.series}
                        </div>
                        <div className={styles.quantityInput}>
                            <label htmlFor="quantity">Количество:</label>
                            <input
                                id="quantity"
                                type="text"
                                value={quantity}
                                onChange={handleQuantityChange}
                                placeholder="Введите количество"
                                className={styles.quantityField}
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div className={styles.modalActions}>
                    <button 
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={creating}
                    >
                        Отменить
                    </button>
                    <button 
                        className={styles.confirmButton}
                        onClick={handleCreateOrder}
                        disabled={!selectedProduct || creating}
                    >
                        {creating ? 'Создание...' : 'Сделать заказ'}
                    </button>
                </div>
            </div>
        </div>
    );
}