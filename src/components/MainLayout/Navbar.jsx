import { NavLink } from "react-router-dom";
import { useState } from "react";
import styles from './MainLayout.module.scss'
import CreateOrderModal from "../CreateOrderModal/CreateOrderModal";

export default function Navbar({ onOrderCreated }){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateOrder = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOrderCreated = (orderId) => {
        if (onOrderCreated) {
            onOrderCreated(orderId);
        }
    };

    return (
        <>
            <div className={styles.wrap__navbar}>
                <nav>
                    <button 
                        className={styles.createOrderBtn}
                        onClick={handleCreateOrder}
                    >
                        Создать заказ
                    </button>
                    <NavLink 
                        to={'/orders'}
                        className={({ isActive }) => 
                            isActive ? styles.active : ''
                        }
                    >
                        Мои заказы
                    </NavLink>
                    <NavLink 
                        to={'/stock'}
                        className={({ isActive }) => 
                            isActive ? styles.active : ''
                        }
                    >
                        Остатки на складе
                    </NavLink>
                    <NavLink 
                        to={'/history'}
                        className={({ isActive }) => 
                            isActive ? styles.active : ''
                        }
                    >
                        История заказов
                    </NavLink>
                </nav>
                <div className={styles.th}/>
            </div>

            {isModalOpen && (
                <CreateOrderModal 
                    onClose={handleCloseModal}
                    onOrderCreated={handleOrderCreated}
                />
            )}
        </>
    )
}