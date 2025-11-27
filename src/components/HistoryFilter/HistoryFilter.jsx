import { useState } from 'react';
import styles from './history__filter.module.scss'
import clsx from "clsx";

export default function HistoryFilter({ sortBy, sortOrder, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSortClick = (field) => {
        if (sortBy === field) {
            onSortChange(field, sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            onSortChange(field, 'ASC');
        }
        setIsOpen(false);
    };

    const getSortIndicator = (field) => {
        if (sortBy === field) {
            return sortOrder === 'ASC' ? ' ↑' : ' ↓';
        }
        return '';
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={styles.filter}>
                <p 
                    className={styles.filter__title}
                    onClick={toggleDropdown}
                >
                    Сортировать по...
                </p>
                
                {isOpen && (
                    <div className={styles.filter__body}>
                        <p 
                            className={clsx(
                                styles.filter__el, 
                                sortBy === 'shipment_date' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('shipment_date')}
                        >
                            Дата отгрузки{getSortIndicator('shipment_date')}
                        </p>
                        <p 
                            className={clsx(
                                styles.filter__el, 
                                sortBy === 'nomenclature' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('nomenclature')}
                        >
                            Номенклатура{getSortIndicator('nomenclature')}
                        </p>
                        <p 
                            className={clsx(
                                styles.filter__el, 
                                sortBy === 'quantity' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('quantity')}
                        >
                            Количество{getSortIndicator('quantity')}
                        </p>
                        <p 
                            className={clsx(
                                styles.filter__el, 
                                sortBy === 'status' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('status')}
                        >
                            Статус{getSortIndicator('status')}
                        </p>
                        <p 
                            className={clsx(
                                styles.filter__el, 
                                sortBy === 'client' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('client')}
                        >
                            Клиент{getSortIndicator('client')}
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}