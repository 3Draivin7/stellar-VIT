import { FC } from 'react';
import styles from './app-footer.module.css';
import phone from '../../svg/phone.svg';
import telegram from '../../svg/telegram.svg';

export const AppFooter: FC = () => (
  <footer className={styles.footer}>
    <h1 className={styles.main_footer}>Звездный Сезон</h1>
    <address className={styles.phone}>
      <img className={styles.phone_img} src={phone} alt='Картинка телефона' />
      Номер ПБО: <a href='tel:+74932373460'>+7(4932) 373-460</a>
    </address>
    <div className={styles.social}>
      <h2 className={styles.social_title}>Наш телеграм:</h2>
      <a className={styles.social_link} href='https://t.me/+MrELjKGtA7kwZjdi'>
        <img
          className={styles.social_img}
          src={telegram}
          alt='Значек Телеграмма'
        />
      </a>
    </div>
  </footer>
);
