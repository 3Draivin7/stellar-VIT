import React, { useState,SyntheticEvent, useEffect } from 'react';
import {useDispatch,useSelector} from "../../services/store"
import {useNavigate, useLocation, Link} from "react-router-dom"
import { login, logout,  checkAuth } from '../../services/slices/user';
import styles from "./login.module.css"
import rules from "../../svg/rules.svg"
import table from "../../svg/table.svg"
import gift from "../../svg/gift.svg"
import key from "../../svg/key.svg" 
import { Preloader } from "../../components/preloader/preloader";

  export function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const lvl = useSelector((state) => state.user.data?.lvl)
    let isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('refreshToken');
    dispatch(checkAuth())
  };
    ///////////////////////////

    const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage('');
      setPasswordError('');
      setEmailError('');
      try {
        if (!email.trim()) {
          setEmailError('Пожалуйста, введите табельный номер');
          return;
        }
  
        if (!password.trim()) {
          setPasswordError('Пожалуйста, введите пароль');
          return;
        }

          const number = parseInt(email, 10);
          setIsLoading(true);
          try {
            await  dispatch(login({ email: number, password })).unwrap();
            navigate('/table'); 
          } catch (error) {
            if (Object.keys(error).length === 0) {
             navigate('/table'); 
            } else {
              setErrorMessage(error);
            }
          } finally {
              setIsLoading(false);
          }
      } catch (error) {
          setErrorMessage(error.message || 'Произошла ошибка при регистрации.');
      }
  };




    return (
      <div>
            <nav className={styles.nav_menu}>
    <ul className={styles.nav_menu_list}>
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
       <Link to='/table'>
        <button
          className={styles.nav_menu_button}>
          <img className={styles.button_logo} src={table} alt="Картинка с таблицей"/>
          Результаты
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
  <section className={styles.profile}>
      <h1 className={styles.profile_title}>
        Вход
      </h1>
      <form className={styles.profile_log} onSubmit={loginSubmit}>
        <span>Табельный номер</span>
        <input className={styles.profile_form} type="number" placeholder="Введите свой табельный номер" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <span className={styles.error}>{emailError}</span>
        <span>Пароль</span>
        <input className={styles.profile_form} type="password" placeholder="Введите свой пароль" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <span className={styles.error}>{passwordError}</span>
        {isLoading ? ( 
      <Preloader/>
    ) :( 
          <span className={styles.error}>{errorMessage}</span>)} 
        <button className={styles.profile_button} type="submit">Войти</button>
      </form>
    </section>
      </div>
    );
  }
  