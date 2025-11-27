import styles from './AuthForm.module.scss';
import { useForm } from 'react-hook-form';
import UiButton from "../../uiKit/UiButton/UiButton.jsx";
import clsx from "clsx";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function AuthForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    
    const navigate = useNavigate();
    const location = useLocation();
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setAuthError('');
        
        try {
            const response = await fetch('https://sergo.kurgasov.ru/api.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: data.Login,
                    password: data.Password
                })
            });
            
            const result = await response.json();
            console.log('Login result:', result);
            
            if (result.success) {
                // Сохраняем в localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('authenticated', 'true');
                
                console.log('Saved to localStorage:', {
                    user: result.user,
                    authenticated: true
                });
                
                const from = location.state?.from?.pathname || '/orders';
                console.log('Redirecting to:', from);
                navigate(from, { replace: true });
            } else {
                setAuthError(result.error || 'Ошибка аутентификации');
            }
        } catch (error) {
            console.error('Login error:', error);
            setAuthError('Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
                <div className="group">
                    <label className={styles.input__names}>Логин</label>
                    <input 
                        type={"text"} 
                        className={clsx(styles.auth__input , errors.Login && styles.auth__input_err)} 
                        placeholder={'Введите логин'}
                        {...register("Login", {
                            required: "Заполните поле",
                            pattern: {
                                value: /^[a-zA-Z0-9_]{1,20}$/,
                                message: "Неккоректные символы"
                            }
                        })} 
                    />
                </div>
                {errors.Login && <span className={styles.text__err}>{errors.Login.message}</span>}

                <div className="group">
                    <label className={styles.input__names}>Пароль</label>
                    <input 
                        type={"password"} 
                        className={clsx(styles.auth__input , errors.Password && styles.auth__input_err)} 
                        placeholder={'Введите пароль'}
                        {...register("Password", {
                            required: "Заполните поле",
                        })} 
                    />
                </div>
                {errors.Password && <span className={styles.text__err}>{errors.Password.message}</span>}
                
                {authError && <span className={styles.text__err}>{authError}</span>}
                
                <UiButton type={'submit'} variant={'purple'} disabled={loading}>
                    {loading ? 'Вход...' : 'Войти'}
                </UiButton>
            </form>
        </>
    );
}