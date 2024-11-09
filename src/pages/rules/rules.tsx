import { FC } from "react";
import styles from "./rules.module.css"
import Home from "../../svg/home.svg"
import table from "../../svg/table.svg"
import gift from "../../svg/gift.svg"
import key from "../../svg/key.svg"
import { Link } from 'react-router-dom';
import { logout, checkAuth } from "../../services/slices/user";
import { useSelector, useDispatch } from "../../services/store";
import { Preloader } from "../../components/preloader/preloader";



export const Rules: FC = () => {

  const dispatch = useDispatch();
  const lvl = useSelector((state) => state.user.data?.lvl)
  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);
const handleLogout = () => {
  dispatch(logout());
  localStorage.removeItem('refreshToken');
  dispatch(checkAuth())
};

  return (
    <body className={styles.page}>
      <main>
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
        <Link to='/table'>
          <button
            class={styles.nav_menu_button}>
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
    <section className={styles.rules}>
      <h1 className={styles.rules_title}>
        Правила
      </h1>
      <p className={styles.rules_text}>
        Для того чтобы получить мерч, нужно набрать определённое количество баллов, которое стоит ценой за выбранный вами приз. Баллы вам будут проставлять менеджеры, тут все по-честному, вы можете самостоятельно отслеживать прогресс своих коллег, свой и, конечно, любоваться в разделе "Призы" своей целью.
      </p>
      <h1 className={styles.rules_title}>
        Критерии
      </h1>
      <p className={styles.rules_text}>
        Чтобы получить баллы, звезды, похвалюшки, как хотите называйте валюту нашего ПБО, вам необходимо (список примерный и может не соответствовать тому , за что вы получите награду)
      </p>
      <ul className={styles.rules_list}>За что можно получить баллы:
        <li className={styles.rules_item}>Выйти на доп смену в выходной</li>
        <li className={styles.rules_item}>Раздвинуть временные возможности</li>
        <li className={styles.rules_item}>Выполнить поставленные цели на смену менеджером</li>
        <li className={styles.rules_item}>Показать себя лучшим на смене и получить от гостей положительную обратную связь</li>
        <li className={styles.rules_item}>Помочь ПБО в делах текущих по департаментам (помочь разобрать униформу, помыть стоки и т.п.), дела желательно выполнять на пробитии!</li>
      </ul>
    </section>
   </main>
  </body>
  )
};
