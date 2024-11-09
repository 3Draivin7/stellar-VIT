import { FC, useState } from 'react'; 
import styles from './addWorker.module.css';  
import { useSelector } from '../../services/store'; 
import { useParams } from 'react-router-dom'; 
import { Modal } from '../modal/modal'; 
import { useNavigate } from 'react-router-dom'; 
import { URL } from '../../utils/burger-api';


interface AddWorkersProps { 
  onClose: () => void; 
} 

export const AddWorkers: FC<AddWorkersProps> = ({ onClose }) => { 
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const who = useSelector((state) => state.user.data?.name); 
  const { number } = useParams<{ number? }>(); 
  const navigate = useNavigate();

  // Состояние для управления видимостью модальных окон 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [showErrorModal, setShowErrorModal] = useState(false); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 


    if (!employeeNumber || !firstName || !lastName) {

      return;
    }

    try {
      // Отправьте данные на сервер
      const response = await fetch(`${URL}worker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: parseInt(employeeNumber, 10),
          name: firstName,
          secondName: lastName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка добавления сотрудника: ${response.status}`);
      }

      setShowSuccessModal(true); // Откройте модальное окно с успехом

      // Очистите поля формы
      setEmployeeNumber('');
      setFirstName('');
      setLastName('');
    } catch (error) {
      // Отобразите сообщение об ошибке, если произошла ошибка
      console.error('Ошибка при добавлении сотрудника:', error);
      // ... Обработайте ошибку 
      setShowErrorModal(true);
    }
  };
  return ( 
    <> 
  <Modal isOpen={!showSuccessModal && !showErrorModal} onClose={onClose}>
        <section className={styles.popup}>
          <h1 className={styles.popup_title}>Добавление сотрудника</h1>
          <form className={styles.popup_log} onSubmit={handleSubmit}>
            <span className={styles.title_form}>Номер сотрудника</span>
            <input
              className={styles.popup_form}
              type="number"
              id="employee-number"
              placeholder="Введите номер сотрудника"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />

            <span className={styles.title_form}>Имя сотрудника</span>
            <input
              className={styles.popup_form}
              type="text"
              id="employee-firstName"
              placeholder="Введите имя сотрудника"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <span className={styles.title_form}>Фамилия сотрудника</span>
            <input
              className={styles.popup_form}
              type="text"
              id="employee-lastName"
              placeholder="Введите фамилию сотрудника"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <button className={styles.popup_button} type="submit">
              Добавить сотрудника
            </button>
          </form>
        </section>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className={styles.popup_title}>Сотрудник успешно добавлен</div>
      </Modal>

      <Modal isOpen={showErrorModal} onClose={() => setShowSuccessModal(false)}> 
        <div className={styles.popup}> <span className={styles.popup_title}>Произошла ошибка при добавлении cотрудника</span></div> 
      </Modal> 
    </>
  ); 
}; 

