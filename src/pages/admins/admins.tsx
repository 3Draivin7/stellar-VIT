import { FC, useEffect, useState } from 'react';
import styles from './admins.module.css';
import underLogo from '../../svg/under_logo.svg';
import Home from '../../svg/home.svg';
import rules from '../../svg/rules.svg';
import gift from '../../svg/gift.svg';
import key from '../../svg/key.svg';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUsers } from '../../services/slices/user/index';
import { logout, checkAuth } from '../../services/slices/user';
import table from '../../svg/table.svg';
import deleate from '../../svg/delete.svg';
import { Modal } from '../../components/modal/modal';
import { Preloader } from '../../components/preloader/preloader';
import { URL } from '../../utils/burger-api';

export const AdminsTable = () => {
  const dispatch = useDispatch();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showTrueModal, setShowTrueModal] = useState(false);
  const [deleteWorkerNumber, setDeleteWorker] = useState(0);
  async function deleteWorker(email: any) {
    try {
      const response = await fetch(`${URL}users/${email}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления работника: ${response.status}`);
      }
      dispatch(fetchUsers());
      setShowTrueModal(false);
      // Обработка успешного удаления
      setDeleteWorker(0);
      setShowSuccessModal(true);
    } catch (error) {
      setShowTrueModal(false);
      setDeleteWorker(0);
      setShowErrorModal(true);
    }
  }

  const isLoading = useSelector((state) => state.worker.loading);
  const lvl = useSelector((state) => state.user.data?.lvl);
  const workers = useSelector((state) => state.user.allData);

  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('refreshToken');
    dispatch(checkAuth());
  };

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
                  <Link to='/gifts'>
                    <button className={styles.nav_menu_button}>
                      <img
                        className={styles.button_logo}
                        src={gift}
                        alt='Картинка подарка'
                      />
                      Призы
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
            <section className={styles.table}>
              <div className={styles.header_table}>
                <img
                  className={styles.header_table_logo}
                  src={underLogo}
                  alt='Медаль'
                />
                <h1 className={styles.header_table_title}>
                  Таблица<span className={styles.size_header}>менеджеров</span>
                </h1>
              </div>
              <div className={styles.table_leaders}>
                <ul className={styles.table_leaders_list}>
                  {workers &&
                    workers.map((worker) => (
                      <li
                        className={
                          lvl !== undefined && lvl > 0
                            ? styles.table_leaders_item_adm
                            : styles.table_leaders_item
                        }
                      >
                        <span className={styles.number}>{worker.email}</span>
                        <span
                          className={styles.name}
                        >{`${worker.name} ${worker.secondName}`}</span>
                        <span className={styles.glasses} />
                        <span className={styles.adm_button_list}>
                          <button
                            onClick={() => {
                              setShowTrueModal(true);
                              setDeleteWorker(worker.email);
                            }}
                            className={styles.adm_button}
                          >
                            <img
                              className={styles.adm_logo}
                              src={deleate}
                              alt='Удалить'
                            />
                          </button>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </section>
          </main>
        </body>
      )}

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className={styles.popup_title}>Менеджер успешно удален</div>
      </Modal>

      <Modal isOpen={showErrorModal} onClose={() => setShowSuccessModal(false)}>
        <div className={styles.popup}>
          {' '}
          <span className={styles.popup_title}>
            Произошла ошибка при удалении менеджера
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
