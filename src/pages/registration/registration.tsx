import { FC, useEffect, useState } from 'react';
import styles from './registration.module.css';
import rules from '../../svg/rules.svg';
import gift from '../../svg/gift.svg';
import key from '../../svg/key.svg';
import table from '../../svg/table.svg';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { SuccesRegistration } from '../../components/succesRegistration/succesRegistration';
import { logout, checkAuth } from '../../services/slices/user';
import { Preloader } from '../../components/preloader/preloader';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/slices/user';

export const RegistrationForm = () => {
  const lvl = useSelector((state) => state.user.data?.lvl);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [secondName, setSecondName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorRegistrationMessage, setErrorRegistrationMessage] = useState<
    string | null | undefined
  >('');
  const registerError = useSelector((state) => state.user.registerError);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setIsOpenModal] = useState(false);
  const [nameError, setNameError] = useState('');
  const [secondNameError, setSecondNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorRegistrationMessage('');
    setNameError('');
    setSecondNameError('');
    setPasswordError('');
    setEmailError('');

    try {
      // Валидация полей ввода
      if (!email.trim()) {
        setEmailError('Пожалуйста, введите табельный номер');
        return;
      }

      if (!password.trim()) {
        setPasswordError('Пожалуйста, введите пароль');
        return;
      }

      if (!name.trim()) {
        setNameError('Пожалуйста, введите имя');
        return;
      }
      if (!secondName.trim()) {
        setSecondNameError('Пожалуйста, введите фамилию');
        return;
      }
      setIsLoading(true);
      try {
        const number = parseInt(email, 10);
        await dispatch(
          register({ name, email: number, password, secondName })
        ).unwrap();
      } catch (error: any) {
        if (Object.keys(error).length === 0) {
          setIsOpenModal(true);
        } else {
          setErrorRegistrationMessage(
            error.message || 'Произошла ошибка при регистрации.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    } catch (error: any) {
      setErrorRegistrationMessage(
        error.message || 'Произошла ошибка при регистрации.'
      );
    }
  };

  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('refreshToken');
    dispatch(checkAuth());
  };

  return (
    <>
      <nav className={styles.nav_menu}>
        <ul className={styles.nav_menu_list}>
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
      <section className={styles.profile}>
        <h1 className={styles.profile_title}>Регистрация</h1>
        <form className={styles.profile_log} onSubmit={handleSubmit}>
          <span>Табельный номер</span>
          <input
            type='number'
            className={styles.profile_form}
            placeholder='Введите свой табельный номер'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className={styles.error}>{emailError}</span>
          <span>Пароль</span>
          <input
            className={styles.profile_form}
            type='password'
            placeholder='Введите свой пароль'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={styles.error}>{passwordError}</span>
          <span>Имя</span>
          <input
            className={styles.profile_form}
            type='text'
            placeholder='Введите свое имя'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className={styles.error}>{nameError}</span>
          <span>Фамилия</span>
          <input
            className={styles.profile_form}
            type='text'
            placeholder='Введите свою фамилию'
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)}
          />
          <span className={styles.error}>{secondNameError}</span>
          {isLoading ? (
            <Preloader />
          ) : (
            <span className={styles.error}>{errorRegistrationMessage}</span>
          )}
          <button className={styles.profile_button} type='submit'>
            Зарегистрироваться
          </button>
        </form>
      </section>
      <SuccesRegistration isOpeng={openModal} />
    </>
  );
};
