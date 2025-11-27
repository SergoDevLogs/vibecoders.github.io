import { useState } from 'react';
import styles from './stock__filter.module.scss'
import clsx from "clsx";

export default function StockFilter({ sortBy, sortOrder, onSortChange }) {
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
                                sortBy === 'num' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('num')}
                        >
                            Номенклатура{getSortIndicator('num')}
                        </p>
                        <p 
                            className={clsx(
                                styles.filter__el, 
                                sortBy === 'series' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('series')}
                        >
                            Серия{getSortIndicator('series')}
                        </p>
                        <p 
                            className={clsx(
                                styles.filter__el, 
                                sortBy === 'lefts' && styles.filter__el_active
                            )}
                            onClick={() => handleSortClick('lefts')}
                        >
                            Остаток{getSortIndicator('lefts')}
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}