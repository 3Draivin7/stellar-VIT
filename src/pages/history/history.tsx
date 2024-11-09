import { FC, useEffect, useState } from "react";
import styles from "./history.module.css"
import Logo from '../../svg/logo.svg'
import underLogo from '../../svg/under_logo.svg'
import Home from "../../svg/home.svg"
import rules from "../../svg/rules.svg"
import gift from "../../svg/gift.svg"
import key from "../../svg/key.svg"
import plus from "../../svg/plus.svg";
import table from "../../svg/table.svg"
import deleate from "../../svg/delete.svg";
import pen from "../../svg/pen.svg"
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from "../../services/store";
import { fetchWorkers } from "../../services/slices/worker";
import { logout, checkAuth } from "../../services/slices/user";
import { Preloader } from "../../components/preloader/preloader";

export const History: FC = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchWorkers())
  }, [dispatch]);

  const isLoading = useSelector(state => state.worker.loading)
  const lvl = useSelector(state => state.user.data?.lvl )
  const worker = useSelector(state => state.worker.workers)

  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);
const handleLogout = () => {
  dispatch(logout());
  localStorage.removeItem('refreshToken');
  dispatch(checkAuth())
};

  return (
    <>
      {isLoading ? (
       <Preloader/>
      ) : ( 
        <div>
          <nav className={styles.nav_menu}>
            <ul className={styles.nav_menu_list}>
              <li className={styles.nav_menu_item}>
                <Link to='/'>
                  <button
                    className={styles.nav_menu_button}>
                    <img className={styles.button_logo} src={Home} alt="Картинка с таблицей"/>
                    Главная
                  </button>
                </Link>
              </li>
              <li className={styles.nav_menu_item}>
                <Link to='/rules'>
                  <button
                    className={styles.nav_menu_button}>
                    <img className={styles.button_logo} src={rules} alt="Картинка с правилами"/>
                    Правила
                  </button>
                </Link>
              </li>
              <li className={styles.nav_menu_item}>
                <Link to='/gifts'>
                  <button
                    className={styles.nav_menu_button}>
                    <img className={styles.button_logo} src={gift} alt="Картинка подарка"/>
                    Призы
                  </button>
                </Link>
              </li>
              {lvl !== undefined && lvl > 1 && (
      <li className={styles.nav_menu_item}>
       <Link to='/mg'>
        <button
          className={styles.nav_menu_button}>
          <img className={styles.button_logo} src={table} alt="Картинка с таблицей"/>
          Менеджеры
        </button>
        </Link>
      </li>
      )}
 <li className={styles.nav_menu_item}>
      {isAuthenticated ? (
        <>
              <button className={styles.nav_menu_button} onClick={handleLogout}>
                <img className={styles.button_logo} src={key} alt="Картинка ключа" />
                Выход
              </button>
          
        </>
      ) : (
        <Link to="/login">
          <button className={styles.nav_menu_button}>
            <img className={styles.button_logo} src={key} alt="Картинка ключа" />
            Вход
          </button>
        </Link>
      )}
    </li>
            </ul>
          </nav>
          <section className={styles.table}>
            <div className={styles.header_table}>
              <img className={styles.header_table_logo} src={underLogo} alt='Медаль'/>
              <h1 className={styles.header_table_title}>История<span className={styles.size_header}>добавления баллов</span></h1>
            </div>
            <div className={styles.table_leaders}>
            {worker && worker.map((worker) => (
              <Link to={`/table/history/${worker.number}`}>
              <button className={styles.hystory_button}>
                <span className={styles.number}>{worker.number}</span><span className={styles.name}>{worker.name} {worker.secondName}</span><span className={styles.glasses}>{worker.points}</span>
              </button>
              </Link>
            ))}
            </div>
          </section>
        </div> 
      )}
    </>
  )
};
