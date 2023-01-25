import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './css/App.css';

import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import Home from './pages/Home';

import { AuthContext } from './context/AuthContext';
import { DataContext } from './context/DataContext';
import SubPayment from './pages/SubPayment';
import OneOrderField from './components/OneOrderField';
import OneOrderConfirmation from './components/OneOrderConfirmation';
import ProfilePage from './pages/ProfilePage';

function App() {
  var user = useContext(AuthContext);
  var data = useContext(DataContext);
  var isLoggedIn : boolean;
  var paymentComplete : boolean;

  if (user) isLoggedIn = true;
  else isLoggedIn = false;

  useEffect(() => {
    document.body.classList.add('bodyDiv');
  })

  // const [isSubscribed, setIsSubscribed] = useState(false)
  var isSubscribed: boolean = false;

  const pullSubData = (subData: boolean) => {
    // setIsSubscribed(subData);
    isSubscribed = subData;
  }

  return (
      <BrowserRouter>
        <Navbar isLoggedIn = {isLoggedIn} isSubscribed = {isSubscribed}/>
          <div className='main'>
              <Routes>

                <Route path='/' element={<Home 
                  isLoggedIn = {isLoggedIn}  
                  data = {data}
                  />}/>

                <Route path='/login' element={<LoginForm/>}/>

                <Route path='/SubPayment' element={<SubPayment props = {pullSubData}/>}/>

                <Route path='/OneOrder' element={<OneOrderField user = {user}/>}/>

                <Route path='/OneOrderConfirmation' element={<OneOrderConfirmation/>}/>

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
