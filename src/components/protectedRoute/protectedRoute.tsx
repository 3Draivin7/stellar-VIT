import React, {useEffect, useState} from 'react';
import { Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { SuccesRegistration } from '../succesRegistration/succesRegistration';
import { fetchUsers, checkAuth } from '../../services/slices/user';
import { Preloader } from '../preloader/preloader';

interface ProtectedRouteProps {
  lvlAdm: number;
  children: React.ReactNode; 
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  lvlAdm,
  children,
}) => {
  const isLoggedIn = useSelector((store) => store.user.isAuthenticated);
  const location = useLocation();
  const dispatch = useDispatch();
  const lvl = useSelector(state => state.user.data?.lvl);
  const isActivated = useSelector(state => state.user.data?.isActivated);
  const isLoading = useSelector((state) => state.allAdmins.isLoading);

  const [dataReady, setDataReady] = useState(false);
  // Загрузка всех администраторов только если пользователь авторизован
  useEffect(() => {

     dispatch(fetchUsers())
     dispatch(checkAuth())
      .then(() => {
       setDataReady(true); // Установите dataReady в true, когда данные загружены
      });
    
   }, [dispatch, isLoggedIn]);

  // Проверка готовности всех необходимых данных
  useEffect(() => {
    if (isLoggedIn && isActivated && !isLoading && lvl !== undefined) {
      setDataReady(true);
    }
  }, [isLoggedIn, isActivated, isLoading, lvl]);

  // Отображение состояния загрузки, пока данные загружаются
  if (!dataReady) {
    return <Preloader/>;
  }

  if (!isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (!isActivated) {
    return <SuccesRegistration isOpeng={true} />;
  }

  if (lvl !== undefined && lvlAdm > lvl) {
    return <Navigate to='/' state={{ from: location }} />;
  }

  // Все условия выполнены, рендеринг защищенного контента
  return children;
};