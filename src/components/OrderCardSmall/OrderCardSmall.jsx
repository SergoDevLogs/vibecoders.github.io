import { useState } from "react";
import styles from "./OrderCardSmall.module.scss";

export default function OrderCardSmall({ 
    orderNumber, 
    status, 
    shipmentDate, 
    productName, 
    orderData, 
    isExpanded,
    onExpand,
    onCollapse 
}) {

    const getStatusColor = (status) => {
        switch(status) {
            case 'Готово но не отгружено':
                return { color: '#BA8F46', text: 'Готово, не отгружено' };
            case 'Отменено':
                return { color: '#C25858', text: 'Отменен' };
            case 'Отгружено':
                return { color: '#5BC86D', text: 'Отгружен' };
            case 'В производстве':
                return { color: '#57ABDC', text: 'В производстве' };
            default:
                return { color: '#BA8F46', text: status };
        }
    };

    const statusInfo = getStatusColor(status);

    const handleDetailsClick = () => {
        if (isExpanded) {
            onCollapse();
        } else {
            onExpand();
        }
    };

    if (isExpanded) {
        return (
            <div className={`${styles.card__wrap} ${styles.card__expanded}`}>
                <div className={styles.card__space}>
                    <p className={styles.card__status} style={{ color: statusInfo.color }}>
                        {statusInfo.text}
                    </p>
                    <p>№{orderNumber}</p>
                </div>
                
                <div className={styles.expanded__content}>
                    <div className={styles.details__grid}>
                        <div className={styles.detail__item}>
                            <span className={styles.detail__label}>Номенклатура: </span>
                            <span className={styles.detail__value}>{orderData.nomenclature || 'Не указано'}</span>
                        </div>
                        <div className={styles.detail__item}>
                            <span className={styles.detail__label}>Тип покрытия: </span>
                            <span className={styles.detail__value}>{orderData.coating_type || 'Не указано'}</span>
                        </div>
                        <div className={styles.detail__item}>
                            <span className={styles.detail__label}>Количество: </span>
                            <span className={styles.detail__value}>{orderData.quantity || '0'}</span>
                        </div>
                        <div className={styles.detail__item}>
                            <span className={styles.detail__label}>Серия: </span>
                            <span className={styles.detail__value}>{orderData.series || 'Не указано'}</span>
                        </div>
                        <div className={styles.detail__item}>
                            <span className={styles.detail__label}>Статус: </span>
                            <span className={styles.detail__value} style={{ color: statusInfo.color }}>
                                {statusInfo.text}
                            </span>
                        </div>
                        <div className={styles.detail__item}>
                            <span className={styles.detail__label}>Клиент: </span>
                            <span className={styles.detail__value}>{orderData.client || 'Не указано'}</span>
                        </div>
                        <div className={styles.detail__item}>
                            <span className={styles.detail__label}>Дата отгрузки: </span>
                            <span className={styles.detail__value}>{orderData.shipment_date || 'Не указана'}</span>
                        </div>
                        
                        {status === 'Отменено' && orderData.cancellation_reason && (
                            <div className={styles.detail__item}>
                                <span className={styles.detail__label}>Причина отмены: </span>
                                <span className={styles.detail__value}>{orderData.cancellation_reason}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className={styles.card__space}>
                    <div></div> {/* Это костыль... */}
                    <p 
                        className={styles.card__description} 
                        onClick={handleDetailsClick}
                        style={{cursor: 'pointer'}}
                    >
                        Скрыть
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card__wrap}>
            <div className={styles.card__space}>
                <p className={styles.card__status} style={{ color: statusInfo.color }}>
                    {statusInfo.text}
                </p>
                <p>№{orderNumber}</p>
            </div>
            <div>
                <p className={styles.card__date}>Дата отгрузки: {shipmentDate || 'Не указана'}</p>
            </div>
            <div className={styles.card__space}>
                <p className={styles.card__itemName}>
                    {productName || 'Номенклатура не указана'}
                </p>
                <p 
                    className={styles.card__description}
                    onClick={handleDetailsClick}
                    style={{cursor: 'pointer'}}
                >
                    Подробнее..
                </p>
            </div>
        </div>
    );
}