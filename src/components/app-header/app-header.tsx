import { FC } from 'react';
import styles from './app-header.module.css'
import Logo from '../../svg/logo.svg'


export const AppHeader: FC = () => {
    return(
        <header className={styles.header}>
        <h1 className={styles.header_title}>
          Звездный Сезон
        </h1>
        <img className={styles.header_logo} src={Logo} alt="Медалька"/>
      </header>
    )
};
