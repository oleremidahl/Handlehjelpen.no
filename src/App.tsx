import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './css/App.css';

import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import Home from './pages/Home';

import { AuthContext } from './context/AuthContext';
import { DataContext } from './context/DataContext';
import OneOrderField from './components/OneOrderField';
import OneOrderConfirmation from './components/OneOrderConfirmation';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  var user = useContext(AuthContext);
  var data = useContext(DataContext);

  useEffect(() => {
    document.body.classList.add('bodyDiv');
  });

  return (
      <BrowserRouter>
        <Navbar />
          <div className='main'>
              <Routes>

                <Route path='/' element={<Home/>}/>

                <Route path='/login' element={<ProtectedRoute><LoginForm/></ProtectedRoute>}/>

                <Route path='/OneOrder' element={<OneOrderField/>}/>

                <Route path='/OrderConfirmation' element={<OneOrderConfirmation/>}/>

                <Route path='/profile' element={<ProfilePage/>}/>

              </Routes>
          </div>
        <Footer />
      </BrowserRouter>
  );
}


export default App;
