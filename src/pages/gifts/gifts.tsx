import { FC, useEffect, useState } from 'react';
import styles from './gifts.module.css';
import rules from '../../svg/rules.svg';
import table from '../../svg/table.svg';
import Home from '../../svg/home.svg';
import key from '../../svg/key.svg';
import deleteImg from '../../svg/delete.svg';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchGifts } from '../../services/slices/gifts/gifts';
import { Modal } from '../../components/modal/modal';
import { logout, checkAuth } from '../../services/slices/user';
import { URL } from '../../utils/burger-api';
import { Preloader } from '../../components/preloader/preloader';

export const Gifts: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGifts());
  }, [dispatch]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showTrueModal, setShowTrueModal] = useState(false);
  const [deleteWorkerNumber, setDeleteWorker] = useState('');
  async function deleteWorker(workerNumber: any) {
    try {
      const response = await fetch(`${URL}gift/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: workerNumber }) // Передаем номер в теле запроса
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления работника: ${response.status}`);
      }
      dispatch(fetchGifts());
      setShowTrueModal(false);
      // Обработка успешного удаления
      setDeleteWorker('');
      setShowSuccessModal(true);
    } catch (error) {
      setShowTrueModal(false);
      setDeleteWorker('');
      setShowErrorModal(true);
    }
  }
  const lvl = useSelector((state) => state.user.data?.lvl);
  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('refreshToken');
    dispatch(checkAuth());
  };

  const gifts = useSelector((state) => state.gifts.gifts);
  const isLoading = useSelector((state) => state.gifts.isLoading);

  return (
    <>
      {isLoading ? (
       <Preloader />
      ) : (
        <body className={styles.page}>
          <main className={styles.main}>
            <nav className={styles.nav_menu}>
              <ul className={styles.nav_menu_list}>
                <li className={styles.nav_menu_item}>
                  <Link to='/'>
                    <button className={styles.nav_menu_button}>
                      <img
                        className={styles.button_logo}
                        src={Home}
                        alt='Картинка с таблицей'
                      />
                      Главная
                    </button>
                  </Link>
                </li>
                <li className={styles.nav_menu_item}>
                  <Link to='/rules'>
                    <button className={styles.nav_menu_button}>
                      <img
                        className={styles.button_logo}
                        src={rules}
                        alt='Картинка с правилами'
                      />
                      Правила
                    </button>
                  </Link>
                </li>
                <li className={styles.nav_menu_item}>
                  <Link to='/table'>
                    <button className={styles.nav_menu_button}>
                      <img
                        className={styles.button_logo}
                        src={table}
                        alt='Картинка с таблицей'
                      />
                      Результаты
                    </button>
                  </Link>
                </li>
                {lvl !== undefined && lvl > 1 && (
                  <li className={styles.nav_menu_item}>
                    <Link to='/mg'>
                      <button className={styles.nav_menu_button}>
                        <img
                          className={styles.button_logo}
                          src={table}
                          alt='Картинка с таблицей'
                        />
                        Менеджеры
                      </button>
                    </Link>
                  </li>
                )}
                <li className={styles.nav_menu_item}>
                  {isAuthenticated ? (
                    <>
                      <button
                        className={styles.nav_menu_button}
                        onClick={handleLogout}
                      >
                        <img
                          className={styles.button_logo}
                          src={key}
                          alt='Картинка ключа'
                        />
                        Выход
                      </button>
                    </>
                  ) : (
                    <Link to='/login'>
                      <button className={styles.nav_menu_button}>
                        <img
                          className={styles.button_logo}
                          src={key}
                          alt='Картинка ключа'
                        />
                        Вход
                      </button>
                    </Link>
                  )}
                </li>
              </ul>
            </nav>

            <section className={styles.gifts}>
              <div className={styles.adm_container}>
                <h1 className={styles.gifts_title}>Подарки</h1>
                {lvl !== undefined && lvl > 1 && (
                  <Link to='/gifts/add'>
                    <button className={styles.add_gift}>
                      Добавить подарок
                    </button>
                  </Link>
                )}
              </div>
              <ul className={styles.gifts_list}>
                {gifts &&
                  gifts.map((gifts) => (
                    <li className={styles.gifts_item}>
                      {lvl !== undefined && lvl > 1 && (
                        <button
                          onClick={() => {
                            setShowTrueModal(true);
                            setDeleteWorker(gifts._id);
                          }}
                          className={styles.delete_button}
                        >
                          <img className={styles.delete_logo} src={deleteImg} />
                        </button>
                      )}
                      <img
                        src={gifts.link}
                        alt=''
                        className={styles.gifts_img}
                      />
                      <h2 className={styles.gifts_name}>{gifts.name}</h2>
                      <p className={styles.gifts_price}>
                        {gifts.points}{' '}
                        <span className={styles.size_price}>похвалюшек</span>
                      </p>
                    </li>
                  ))}
              </ul>
            </section>
          </main>
        </body>
      )}

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className={styles.popup_title}>Подарок успешно удален</div>
      </Modal>
      <Modal isOpen={showErrorModal} onClose={() => setShowSuccessModal(false)}>
        <div className={styles.popup}>
          {' '}
          <span className={styles.popup_title}>
            Произошла ошибка при удалении подарка
          </span>
        </div>
      </Modal>
      <Modal isOpen={showTrueModal} onClose={() => setShowTrueModal(false)}>
        <section className={styles.popup}>
          <h1 className={styles.popup_title}>Вы уверены?</h1>
          <div className={styles.popup_log}>
            <div className={styles.button_container}>
              <button
                className={styles.popup_button}
                onClick={() => deleteWorker(deleteWorkerNumber)}
              >
                Да
              </button>
              <button
                className={styles.popup_button}
                onClick={() => setShowTrueModal(false)}
              >
                Нет
              </button>
            </div>
          </div>
        </section>
      </Modal>
    </>
  );
};
