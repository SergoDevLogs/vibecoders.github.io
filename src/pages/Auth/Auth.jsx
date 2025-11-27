import styles from './Auth.module.scss'
import AuthForm from "../../components/AuthForm/AuthForm.jsx";

export default function Auth() {
    return(
        <>
           <div className={styles.auth_screen}>
               <div className={styles.wrap__auth}>
                   <div className={styles.auth__header}>
                       <img src="/src/assets/auth_profile.svg" alt=""/>
                       <p className={styles.auth__title}>Войдите в аккаунт</p>
                       <p className={styles.auth_subtitle}>Введите логин и пароль в форме ниже</p>
                   </div>
                   <div>
                       <AuthForm/>
                   </div>
               </div>
           </div>
        </>
    )
}