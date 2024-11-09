import React, { useState, FC } from 'react';
import { Modal } from '../modal/modal';
import { useNavigate } from 'react-router-dom';
import styles from './addGifts.module.css'; // Предполагается, что у вас есть файл styles.module.css
import { URL } from '../../utils/burger-api';

interface AddGiftsProps { 
  onClose: () => void; 
} 

export const AddGift: FC<AddGiftsProps> = ({ onClose }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [giftName, setGiftName] = useState('');
  const [giftPoints, setGiftPoints] = useState('');
  const [giftImageUrl, setGiftImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Замените это реальным вызовом API  
    try {
      // Имитация вызова API
      const response = await fetch(`${URL}gift/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: giftName,
          points: giftPoints,
          link: giftImageUrl,
        }),
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setShowErrorModal(true);
    }
  };


  return (
    <>
      {/* Модальное окно для формы */}
      <Modal
        isOpen={!showSuccessModal && !showErrorModal}
        onClose={onClose}
      >
        <section className={styles.popup}>
          <h1 className={styles.popup_title}>Добавление подарков</h1>
          <form className={styles.popup_log} onSubmit={handleSubmit}>
            <span className={styles.title_form}>Название подарка</span>
            <input
              className={styles.popup_form}
              type="text"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              name="giftName"
              placeholder="Введите название подарка"
              required
            />
            <span className={styles.title_form}>Количество баллов</span>
            <input
              className={styles.popup_form}
              type="number"
              value={giftPoints}
              onChange={(e) => setGiftPoints(e.target.value)}
              name="giftPoints"
              placeholder="Введите цену подарка"
              required
            />
            <span className={styles.title_form}>Фотография подарка</span>
            <input
              className={styles.popup_form}
              type="text"
              value={giftImageUrl}
              onChange={(e) => setGiftImageUrl(e.target.value)}
              name="giftImageUrl"
              placeholder="Введите URL фотографии подарка"
              required
            />
            <button className={styles.popup_button} type="submit">
              Добавить подарок
            </button>
          </form>
        </section>
      </Modal>

      {/* Модальное окно для успешной отправки */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => navigate('/gifts')}
      >
        <div className={styles.popup}>
          <span className={styles.popup_title}>
            Приз успешно добавлен
          </span>
        </div>
      </Modal>

      {/* Модальное окно для ошибок */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => navigate('/gifts')}
      >
        <div className={styles.popup}>
          <span className={styles.popup_title}>
            Произошла ошибка при добавлении приза
          </span>
        </div>
      </Modal>
    </>
  );
};

