import React, { useState, FC } from 'react';
import { Modal } from '../modal/modal';
import { useNavigate, Link } from 'react-router-dom';
import styles from './succesRegistration.module.css'; // Предполагается, что у вас есть файл styles.module.css

interface SuccesRegistrationProps{
  isOpeng:boolean;
}

export const SuccesRegistration: FC<SuccesRegistrationProps> = ({ isOpeng }) => {
  const navigate = useNavigate();
  const onClose = () => {
navigate('/')
}

  return (
    <>
      {/* Модальное окно для формы */}
      <Modal
        isOpen={isOpeng}
        onClose={onClose}
      >
    <section className={styles.popup}>
      <h1 className={styles.popup_title}>
        Завершение регистрации
      </h1>
      <form className={styles.popup_log}>
        <span className={styles.title_form}>Дождитесь подтверждения регистрации. Для ускорения процесса обратитесь к своему рукводителю департамента "Люди".</span>
        <Link to='/'>
        <button 
  className={styles.popup_button} 
  type="submit" 
  style={{ margin: 'auto', width: '225px' }} 
>
  На главную
</button> 
</Link>
      </form>
    </section>
      </Modal>
    </>
  );
};

