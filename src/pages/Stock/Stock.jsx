import {usePageTitle} from "../../context/PageTitleContext.jsx";
import {useEffect, useState} from "react";
import styles from "./stock.module.scss";
import StockCard from "../../components/StockCard/StockCard";
import StockFilter from "../../components/StockFilter/StockFilter";

export default function Stock() {
    const {setTitle} = usePageTitle()
    const [leftovers, setLeftovers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('series');
    const [sortOrder, setSortOrder] = useState('ASC');

    useEffect(() => {
        setTitle('Остатки на складе')
    }, [])

    const fetchLeftovers = async (sortField = 'series', order = 'ASC') => {
        try {
            setLoading(true);
            
            const url = `https://sergo.kurgasov.ru/api.php?action=getLeftovers&sortBy=${sortField}&sortOrder=${order}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                setLeftovers(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Ошибка при загрузке данных');
            console.error('Error fetching leftovers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeftovers(sortBy, sortOrder);
    }, [sortBy, sortOrder]);

    const handleSortChange = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
    };

    if (loading) {
        return (
            <div className={styles.stock__wrap}>
                <div className={styles.loading}>Загрузка данных...</div>
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
               <div className={styles.stock__table}>
                    <div className={styles.stock__inner}>
                   <StockCard isHeader={true} nomenclature={'Номенклатура'} series={'Серия'} count={'Остаток'}/>
                   
                   {leftovers.map((item, index) => (
                       <StockCard 
                           key={index}
                           nomenclature={item.num || 'Не указано'}
                           series={item.series || 'Не указано'}
                           count={`${item.lefts || 0}`}
                       />
                   ))}
                   
                   {leftovers.length === 0 && (
                       <div className={styles.no_data}>Нет данных для отображения</div>
                   )}
               </div>
               </div>
               <div>
                   <StockFilter 
                       sortBy={sortBy}
                       sortOrder={sortOrder}
                       onSortChange={handleSortChange}
                   />
               </div>
           </div>
        </>
    )
}