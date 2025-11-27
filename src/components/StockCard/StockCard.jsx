import styles from "./stock__card.module.scss";
export default function StockCard({ nomenclature, series, count, isHeader }) {
    return (
        <div className={styles.card}>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{nomenclature}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{series}</div>
            <div className={`${styles.card__el} ${isHeader ? styles.header : ""}`}>{count}</div>
        </div>
    );
}
