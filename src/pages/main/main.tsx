import { FC, useEffect } from 'react';
import styles from './main.module.css';
import underLogo from '../../svg/under_logo.svg';
import rules from '../../svg/rules.svg';
import table from '../../svg/table.svg';
import gift from '../../svg/gift.svg';
import key from '../../svg/key.svg';
import { useSelector } from '../../services/store';
import { Link } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logout, checkAuth } from '../../services/slices/user';
import { useCallback } from 'react';

export const Main: FC = () => {
  const dispatch = useDispatch();
  const mix = require('../../img/mix.jpg');
  const swit = require('../../img/swit.jpg');
  const heart = require('../../img/heart.jpg');
  const meeting = require('../../img/meeting.jpg');
  const brth = require('../../img/brth.jpg');
  const lvl = useSelector((state) => state.user.data?.lvl);
  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('refreshToken');
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <body className={styles.page}>
      <main className={styles.main}>
        <section className={styles.under_header}>
          <h1 className={styles.under_header_title}>
            Нет никакого смысла в состязании,
            <span className={styles.accent_color_yellow}>
              если ты не веришь в свою победу.
            </span>
          </h1>
          <img
            className={styles.under_header_img}
            src={underLogo}
            alt='Логотип "Вкусно и точка"'
          />
        </section>

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

        <section className={styles.greeting}>
          <h1 className={styles.greeting_title}>Дорогие ребята!</h1>
          <p className={styles.greeting_text}>
            Ну ж что ж, котятки, вы все у нас звезды и это беспорно, но сейчас
            начнём нашу новую главу под названием "Звёздный сезон ", где вы
            докажите своё звание не только для нас! Что же это такое? Это
            возможность получить уникальные призы (посхалочка, они будут
            дополняться и пополняться), посоревноваться с коллегами и друзьями,
            и доказать кто же тут папочка или мамочка! Это проект разработан для
            нашего ПБО и является уникальным, ни в одном предприятии такой
            потехи нет, мы хотим чтобы вы тоже с радостью приходили на смену и
            знали что можете получить то, о чем давно мечтали и это не только
            зарплата!
          </p>
        </section>

        <section className={styles.galery}>
          <ul className={styles.galery_list}>
            <li className={`${styles.galery_list_item} ${styles.birthday}`}>
              <img
                className={styles.galery_list_photo}
                src={brth}
                alt='Фото ПБО'
              />
            </li>
            <li className={`${styles.galery_list_item} ${styles.mix}`}>
              <img
                className={`${styles.galery_list_photo} ${styles.heart}`}
                src={mix}
                alt='Фото ПБО'
              />
            </li>
            <li className={`${styles.galery_list_item} ${styles.swit}`}>
              <img
                className={styles.galery_list_photo}
                src={swit}
                alt='Фото ПБО'
              />
            </li>
            <li className={`${styles.galery_list_item} ${styles.heart}`}>
              <img
                className={styles.galery_list_photo}
                src={heart}
                alt='Фото ПБО'
              />
            </li>
            <li className={`${styles.galery_list_item} ${styles.meeting}`}>
              <img
                className={styles.galery_list_photo}
                src={meeting}
                alt='Фото ПБО'
              />
            </li>
          </ul>
        </section>
      </main>
    </body>
  );
};
