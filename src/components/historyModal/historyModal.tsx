import { FC, useState } from 'react';
import styles from './historyModal.module.css';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { Modal } from '../modal/modal';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface HistoryModalProps {
  onClose: () => void;
}

export const HistoryModal: FC<HistoryModalProps> = ({ onClose }) => {
  const workerNumber = useParams<{ number?: string }>();
  const workerNumberInt = workerNumber.number
    ? parseInt(workerNumber.number, 10)
    : null;
  const workers = useSelector((state) => state.worker.workers);

  const foundWorker = workers.find(
    (worker) => worker.number === workerNumberInt
  );
  return (
    <Modal isOpen onClose={onClose}>
      <section className={styles.popup}>
        <h1 className={styles.title_popup}>
          История добавления баллов {foundWorker?.number} {foundWorker?.name}{' '}
          {foundWorker?.secondName}
        </h1>
        <ul className={styles.hystory_list}>
          {foundWorker &&
            foundWorker.history.map((history) => (
              <li className={styles.hystory_list_item}>
                <span className={styles.name_workers}>{history.who}</span>
                <span className={styles.glasses_workers}>{history.points}</span>
              </li>
            ))}
        </ul>
        <Link to='/history'>
          <button className={styles.popup_button} type='submit'>
            Вернуться
          </button>
        </Link>
      </section>
    </Modal>
  );
};
