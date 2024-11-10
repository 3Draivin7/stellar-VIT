import { FC, useState } from 'react';
import styles from './addGlasses.module.css';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { Modal } from '../modal/modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { URL } from '../../utils/burger-api';

interface AddGlassesProps {
  onClose: () => void;
}

export const AddGlasses: FC<AddGlassesProps> = ({ onClose }) => {
  const [points, setPoints] = useState('');
  const name = useSelector((state) => state.user.data?.name);
  const secondName = useSelector((state) => state.user.data?.secondName);
  const who = name + ' ' + secondName;
  const { number } = useParams<{ number?: any }>();
  const navigate = useNavigate();
  const workers = useSelector((state) => state.worker.workers);
  const foundWorker = workers.find(
    (worker) => worker.number === parseInt(number, 10)
  );
  // Состояние для управления видимостью модальных окон
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (points && who) {
      try {
        const response = await fetch(`${URL}worker/addpoints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            points: parseInt(points, 10),
            who: who,
            number: parseInt(number, 10)
          })
        });

        if (!response.ok) {
          throw new Error(`Ошибка добавления баллов: ${response.status}`);
        }

        const data = await response.json();
        setPoints('');
        setShowSuccessModal(true); // Открыть модальное окно с успехом
      } catch (error) {
        console.error('Ошибка при добавлении баллов:', error);
        setShowErrorModal(true); // Открыть модальное окно с ошибкой
      }
    }
  };

  return (
    <>
      {/* Модальное окно для формы */}
      <Modal isOpen={!showSuccessModal && !showErrorModal} onClose={onClose}>
        <section className={styles.popup}>
          <h1 className={styles.popup_title}>
            Добавление баллов для {number}{' '}
            {foundWorker !== undefined &&
              foundWorker?.name.charAt(0).toUpperCase() +
                foundWorker?.name.slice(1)}{' '}
            {foundWorker !== undefined &&
              foundWorker?.secondName.charAt(0).toUpperCase() +
                foundWorker?.secondName.slice(1)}
          </h1>
          <form className={styles.popup_log} onSubmit={handleSubmit}>
            <span className={styles.title_form}>Количество баллов</span>
            <input
              className={styles.popup_form}
              type='number'
              placeholder='Введите количество баллов'
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            <button className={styles.popup_button} type='submit'>
              Добавить баллы
            </button>
          </form>
        </section>
      </Modal>

      {/* Модальное окно для успешной отправки */}
      <Modal isOpen={showSuccessModal} onClose={() => navigate('/table')}>
        <div className={styles.popup}>
          <span className={styles.popup_title}>Баллы успешно добавлены</span>
        </div>
      </Modal>

      {/* Модальное окно для ошибок */}
      <Modal isOpen={showErrorModal} onClose={() => navigate('/table')}>
        <div className={styles.popup}>
          {' '}
          <span className={styles.popup_title}>
            Произошла ошибка при добавлении баллов
          </span>
        </div>
      </Modal>
    </>
  );
};
