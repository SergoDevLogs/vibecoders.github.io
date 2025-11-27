import styles from './UiButton.module.scss'
import clsx from "clsx";
export default function UiButton({onClick,type,children,variant,classList}){
    const btnClassname = clsx(classList, styles.ui__button,variant === 'purple' ? 'purple' : 'gray')
    return(
        <button className={btnClassname} onClick={onClick} type={type}>{children}</button>
    )
}