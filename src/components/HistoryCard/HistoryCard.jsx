// components/HistoryCard/HistoryCard.jsx
import styles from "./history__card.module.scss";

export default function HistoryCard({
    shipment_date,
    nomenclature,
    coating_type,
    quantity,
    cancellation_reason,
    series,
    status,
    client,
    isHeader
}) {
    return (
        <div className={styles.card}>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{shipment_date}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{nomenclature}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{coating_type}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{quantity}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{cancellation_reason}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{series}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{status}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{client}</div>
        </div>
    );
}
