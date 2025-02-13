import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Main } from '../../pages/main/main';
import { LoginPage } from '../../pages/login/login';
import { AppHeader } from '../app-header/app-header';
import { AppFooter } from '../app-footer/app-footer';
import { Table } from '../../pages/table/table';
import { Rules } from '../../pages/rules/rules';
import { Gifts } from '../../pages/gifts/gifts';
import { ProtectedRoute } from '../protectedRoute/protectedRoute';
import { useDispatch } from '../../services/store';
import { checkAuth } from '../../services/slices/user';
import { AdminsTable } from '../../pages/admins/admins';
import { AddGlasses } from '../addGlasses/addGlasses';
import { AddWorkers } from '../addWorker/addWorker';
import { History } from '../../pages/history/history';
import { HistoryModal } from '../historyModal/historyModal';
import { DeleteGlasses } from '../deleteGlasses/deleteGlasses';
import { AddGift } from '../addGifts/addGifts';
import { RegistrationForm } from '../../pages/registration/registration';
import { fetchWorkers } from '../../services/slices/worker';
import Snowfall from "react-snowfall";
import heartImgUrl from '../../svg/heart.svg';
import { rgb } from 'polished';

export function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closeModal = () => {
    navigate(-1);
  };

  const location = useLocation();
  const background = location.state && location.state.background;

  const [isSnowing, setIsSnowing] = useState(false);
  const [heartImg, setHeartImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(checkAuth());
        await dispatch(fetchWorkers());
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const img = new Image();
    img.src = heartImgUrl; // Use the imported URL

    img.onload = () => {
      setHeartImg(img);
    };

    img.onerror = () => {
      console.error("Failed to load heart image:", heartImgUrl);
    };
  }, [heartImgUrl]);

  useEffect(() => {
    // Запускаем снег через 1 секунду после загрузки страницы
    const timer = setTimeout(() => {
      setIsSnowing(true);
    }, 1000);

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, []);

  return (
    <div>
      {heartImg && isSnowing && ( // Убедитесь, что heartImg загружено И isSnowing true
        <Snowfall
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%'}}
          snowflakeCount={50}
          color={rgb(102,102,102)}
          radius={[11,11]}
          speed={[3, 0]}
          wind={[0,0]}
          images={[heartImg]} // Pass the loaded image object
        />
      )}
      <AppHeader />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/table' element={<Table />} />
        <Route path='/rules' element={<Rules />} />
        <Route path='/gifts' element={<Gifts />} />
        <Route
          path='/registration/y821386yr8623fg8gdg7q8wdgqwd8y6y8r3'
          element={<RegistrationForm />}
        />

        <Route
          path='/mg'
          element={
            <ProtectedRoute lvlAdm={2}>
              <AdminsTable />
            </ProtectedRoute>
          }
        />
        <Route
          path='/history'
          element={
            <ProtectedRoute lvlAdm={2}>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path='/table/addpoint/:number'
          element={
            <ProtectedRoute lvlAdm={1}>
              <AddGlasses onClose={closeModal} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/table/addworkers'
          element={
            <ProtectedRoute lvlAdm={2}>
              <AddWorkers onClose={closeModal} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/table/history/:number'
          element={
            <ProtectedRoute lvlAdm={2}>
              <HistoryModal onClose={closeModal} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/table/deletepoints/:number'
          element={
            <ProtectedRoute lvlAdm={2}>
              <DeleteGlasses onClose={closeModal} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/gifts/add'
          element={
            <ProtectedRoute lvlAdm={2}>
              <AddGift onClose={closeModal} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <AppFooter />
    </div>
  );
}
