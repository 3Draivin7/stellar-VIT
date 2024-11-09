import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Main } from '../../pages/main/main';
import { LoginPage } from '../../pages/login/login';
import { AppHeader } from '../app-header/app-header';
import { AppFooter } from '../app-footer/app-footer';
import { Table } from '../../pages/table/table';
import { Rules } from '../../pages/rules/rules';
import { Gifts } from '../../pages/gifts/gifts';
import { ProtectedRoute } from '../protectedRoute/protectedRoute'
import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';
import { checkAuth } from '../../services/slices/user';
import { AdminsTable } from '../../pages/admins/admins';
import { AdminsPanel } from '../../pages/admin-panel/admin-panel';
import { Modal } from '../modal/modal';
import { AddGlasses } from '../addGlasses/addGlasses';
import { AddWorkers } from '../addWorker/addWorker';
import { History } from '../../pages/history/history';
import { HistoryModal } from '../historyModal/historyModal';
import { DeleteGlasses } from '../deleteGlasses/deleteGlasses';
import { AddGift } from '../addGifts/addGifts';
import { RegistrationForm } from '../../pages/registration/registration';
import { fetchUsers } from '../../services/slices/user/index';
import { fetchWorkers } from '../../services/slices/worker';

export function App() {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const closeModal = () => {
  navigate(-1);
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(checkAuth()); 
      //  await dispatch(fetchUsers())
      await dispatch(fetchWorkers())
      } catch (e){
      }
    };
    fetchData(); 
  }, [dispatch]);

  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <div>
      <AppHeader />
    <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/table' element={<Table />} />
        <Route path='/rules' element={<Rules />} />
        <Route path='/gifts' element={<Gifts />} />       
         <Route path='/registration/y821386yr8623fg8gdg7q8wdgqwd8y6y8r3' element={<RegistrationForm />} />

        <Route
         path='/mg' 
         element={
         <ProtectedRoute lvlAdm={2} >
          <AdminsTable />
          </ProtectedRoute>} />
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
                <AddGlasses onClose={closeModal}/>
                </ProtectedRoute>
            }
          />
                      <Route
            path='/table/addworkers'
            element={
              <ProtectedRoute lvlAdm={2}>
                <AddWorkers onClose={closeModal}/>
                </ProtectedRoute>
            }
          />
                      <Route
            path='/table/history/:number'
            element={
              <ProtectedRoute lvlAdm={2}>
                <HistoryModal onClose={closeModal}/>
                </ProtectedRoute>
            }
          />
                      <Route
            path='/table/deletepoints/:number'
            element={
              <ProtectedRoute lvlAdm={2}>
                <DeleteGlasses onClose={closeModal}/>
                </ProtectedRoute>
            }
          />
                      <Route
            path='/gifts/add'
            element={
              <ProtectedRoute lvlAdm={2}>
                <AddGift onClose={closeModal}/>
                </ProtectedRoute>
            }
          />

        </Routes>
        <AppFooter />
        </div>
  )};
