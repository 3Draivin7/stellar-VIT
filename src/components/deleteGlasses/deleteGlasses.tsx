import { FC, useState } from 'react'; 
import styles from './deleteGlasses.module.css';  
import { useSelector } from '../../services/store'; 
import { useParams } from 'react-router-dom'; 
import { Modal } from '../modal/modal'; 
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { URL } from '../../utils/burger-api';

interface DeleteGlassesProps { 
  onClose: () => void; 
} 

export const DeleteGlasses: FC<DeleteGlassesProps> = ({ onClose }) => { 
  const [points, setPoints] = useState(''); 
  const { number } = useParams<{ number? }>(); 
  const navigate = useNavigate();

  // Состояние для управления видимостью модальных окон 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [showErrorModal, setShowErrorModal] = useState(false); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault(); 

    if (points) { 
      try { 
        const response = await fetch(`${URL}worker/deletepoints`, { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json', 
          }, 
          body: JSON.stringify({ 
            points: parseInt(points, 10), 
            number: parseInt(number, 10), 
          }), 
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
        Убавление баллов
      </h1>
      <form className={styles.popup_log} onSubmit={handleSubmit}> 
        <span className={styles.title_form}>Количество баллов</span>
        <input 
              className={styles.popup_form} 
              type="number" 
              placeholder="Введите количество баллов" 
              value={points} 
              onChange={(e) => setPoints(e.target.value)} 
            /> 
        <button className={styles.popup_button} type="submit">Убавить баллы</button>
      </form>
    </section>
      </Modal> 
      {/* Модальное окно для успешной отправки */} 
      <Modal isOpen={showSuccessModal} onClose={() => navigate('/table')}> 
        <div  className={styles.popup}>
          <span className={styles.popup_title}>Баллы успешно убавлены</span></div> 
      </Modal> 

      {/* Модальное окно для ошибок */} 
      <Modal isOpen={showErrorModal} onClose={() => navigate('/table')}> 
        <div className={styles.popup}> <span className={styles.popup_title}>Произошла ошибка при убавлении баллов</span></div> 
      </Modal> 
    </> 
  ); 
}; 

