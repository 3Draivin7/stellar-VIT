import { FC, useEffect, useState } from "react";
import styles from "./table.module.css"
import Logo from '../../svg/logo.svg'
import underLogo from '../../svg/under_logo.svg'
import Home from "../../svg/home.svg"
import rules from "../../svg/rules.svg"
import gift from "../../svg/gift.svg"
import key from "../../svg/key.svg"
import plus from "../../svg/plus.svg";
import deleate from "../../svg/delete.svg";
import pen from "../../svg/pen.svg"
import { Link, useSearchParams } from 'react-router-dom';  
import { useDispatch, useSelector } from "../../services/store";
import { fetchWorkers } from "../../services/slices/worker";
import { Modal } from "../../components/modal/modal";
import table from "../../svg/table.svg"
import { logout, checkAuth } from "../../services/slices/user";
import { Preloader } from "../../components/preloader/preloader";
import { URL } from "../../utils/burger-api";



export const Table: FC = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchWorkers())
  }, [dispatch]);

  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [showErrorModal, setShowErrorModal] = useState(false); 
  const [showTrueModal, setShowTrueModal] = useState(false); 
  const [deleteWorkerNumber, setDeleteWorker] = useState(0);
  async function deleteWorker(workerNumber) {
    try {
     const response = await fetch(`${URL}worker/delete`, {
      method: 'DELETE',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number: workerNumber }), // Передаем номер в теле запроса
     });
   
     if (!response.ok) {
      throw new Error(`Ошибка удаления работника: ${response.status}`);
     }
     dispatch(fetchWorkers())
     setShowTrueModal(false)
     // Обработка успешного удаления
     setDeleteWorker(0);
     setShowSuccessModal(true);
    } catch (error) {
      setShowTrueModal(false)
      setDeleteWorker(0);
     setShowErrorModal(true)
    }
   }
   

  const isLoading = useSelector(state => state.worker.loading)
const lvl = useSelector(state => state.user.data?.lvl )
const workerss = useSelector(state => state.worker.workers)
const workers = workerss.map((employee) => ({
  name: employee.name.charAt(0).toUpperCase() + employee.name.slice(1),
  secondName: employee.secondName.charAt(0).toUpperCase() + employee.secondName.slice(1),
  number: employee.number,
  points: employee.points,
  history: employee.history
 }));
const worker = [...workers].sort((a, b) => a.number - b.number); 

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
    ) :(
        <body className={styles.page}>

        <main className={styles.main}>
    
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
          <h1 className={styles.header_table_title}>Таблица<span className={styles.size_header}>результатов</span></h1>
        </div>
        <div className={styles.table_leaders}>
        {lvl !== undefined && lvl === 2 && (
          <div className={styles.button_container}>
        <Link className={styles.table_leaders_list} to='/table/addworkers'>
            <button className={styles.add_button}>Добавить сотрудника</button>
            </Link>
            <Link className={styles.table_leaders_list} to='/history'>
            <button className={styles.add_button}>История добавления баллов</button>
            </Link>
            </div>
)}
          <ul className={styles.table_leaders_list}>
            {worker && worker.map((worker) => (
            <li className={lvl !== undefined && lvl > 0 ? styles.table_leaders_item_adm : styles.table_leaders_item}>
              <span className={styles.number}>{worker.number}</span><span className={styles.name}>{`${worker.name} ${worker.secondName}`}</span><span className={styles.glasses}>{worker.points}</span>
              <span className={styles.adm_button_list}>
              {lvl !== undefined && lvl > 0 && (
              <Link to={`/table/addpoint/${worker.number}`}>
                <button className={styles.adm_button}>
                  <img className={styles.adm_logo} src={plus}/>
                </button>
                </Link>
              )}
{lvl !== undefined && lvl === 2 && ( 
  <>
    <button onClick={() => {setShowTrueModal(true); setDeleteWorker(worker.number)}} className={styles.adm_button}>
      <img className={styles.adm_logo} src={deleate} alt="Удалить" />
    </button>
    <Link to={`/table/deletepoints/${worker.number}`}>
      <button className={styles.adm_button}>
        <img className={styles.adm_logo} src={pen} alt="Редактировать" />
      </button>
    </Link>
  </>
)}
              </span>
            </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
      </body> 
    )}

    
<Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className={styles.popup_title}>Сотрудник успешно удален</div>
      </Modal>

      <Modal isOpen={showErrorModal} onClose={() => setShowSuccessModal(false)}> 
        <div className={styles.popup}> <span className={styles.popup_title}>Произошла ошибка при удалении cотрудника</span></div> 
      </Modal> 
      <Modal isOpen={showTrueModal} onClose={() => setShowTrueModal(false)}> 
      <section className={styles.popup}>
      <h1 className={styles.popup_title}>
        Вы уверены?
      </h1>
        <div className={styles.popup_log}>
        <div className={styles.button_container_two}>
        <button className={styles.popup_button} onClick={() => deleteWorker(deleteWorkerNumber)}>Да</button>
        <button className={styles.popup_button} onClick={() => setShowTrueModal(false)}>Нет</button>
        </div>
        </div>

    </section>
      </Modal> 
    </>
  )};
  