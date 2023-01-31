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

function App() {
  var user = useContext(AuthContext);
  var data = useContext(DataContext);
  var isLoggedIn : boolean;

  if (user) isLoggedIn = true;
  else isLoggedIn = false;

  useEffect(() => {
    document.body.classList.add('bodyDiv');
  })

  return (
      <BrowserRouter>
        <Navbar isLoggedIn = {isLoggedIn} />
          <div className='main'>
              <Routes>

                <Route path='/' element={<Home 
                  isLoggedIn = {isLoggedIn}  
                  data = {data}
                  />}/>

                <Route path='/login' element={<LoginForm/>}/>

                <Route path='/OneOrder' element={<OneOrderField user = {user}/>}/>

                <Route path='/OrderConfirmation' element={<OneOrderConfirmation/>}/>

                <Route path='/profile' element={<ProfilePage
                  isLoggedIn = {isLoggedIn}  
                  data = {data}
                  />}/>

              </Routes>
          </div>
        <Footer />
      </BrowserRouter>
  );
}


export default App;
