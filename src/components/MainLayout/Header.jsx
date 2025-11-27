import styles from './MainLayout.module.scss'
import {usePageTitle} from "../../context/PageTitleContext.jsx";
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { title } = usePageTitle();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authenticated');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    return (
        <>
            <div className='container'>
                <div className={styles.header}>
                    <p className={styles.title__header}>{title}</p>
                   <div className={styles.text__exit} onClick={handleLogout} style={{cursor: 'pointer'}}>
                       <img src="/exit.svg" alt=""/>
                       <p className=''>Выйти из профиля</p>
                   </div>
                </div>
            </div>
        </>
    );
}