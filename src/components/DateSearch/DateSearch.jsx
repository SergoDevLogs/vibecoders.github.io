import { useState } from 'react';
import styles from './DateSearch.module.scss';

export default function DateSearch({ onFilter, onReset, resultCount, totalCount }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderNumber, setOrderNumber] = useState('');

    const handleFilter = () => {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end && start > end) {
            alert('Дата начала не может быть больше даты окончания');
            return;
        }
        
        onFilter(start, end, orderNumber);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setOrderNumber('');
        onReset();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleFilter();
        }
    };

    return (
        <div className={styles.dateSearch}>
            <div className={styles.dateSearch__header}>
                <h3 className={styles.dateSearch__title}>Поиск заказов</h3>
                <div className={styles.dateSearch__stats}>
                    Найдено: {resultCount} из {totalCount}
                </div>
            </div>
            
            <div className={styles.dateSearch__controls}>
                <div className={styles.searchInput}>
                    <label className={styles.searchInput__label}>Номер заказа:</label>
                    <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={styles.searchInput__field}
                        placeholder="Введите номер заказа"
                        dir="ltr"
                    />
                </div>

                <div className={styles.dateInput}>
                    <label className={styles.dateInput__label}>От:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={styles.dateInput__field}
                        dir="ltr"
                    />
                </div>
                
                <div className={styles.dateInput}>
                    <label className={styles.dateInput__label}>До:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={styles.dateInput__field}
                        dir="ltr"
                    />
                </div>
                
                <div className={styles.dateSearch__buttons}>
                    <button 
                        onClick={handleFilter}
                        className={styles.filterButton}
                    >
                        Применить
                    </button>
                    <button 
                        onClick={handleReset}
                        className={styles.resetButton}
                    >
                        Сбросить
                    </button>
                </div>
            </div>
        </div>
    );
}