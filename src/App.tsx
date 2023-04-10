import React, { useContext, useEffect, useState } from 'react';
import { HashRouter as BrowserRouter, Route, Routes } from 'react-router-dom';

import './css/App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';

import { AuthContext } from './context/AuthContext';
import OneOrderConfirmation from './components/OneOrderConfirmation';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import SmallLogin from './components/SmallLogin';
import SmallRegistration from './components/SmallRegistration';
import TermsAndConditions from './pages/T&C';
import ScrollToTop from './components/ScrollToTop';
import { firestore } from './base';
import { doc, getDoc } from 'firebase/firestore';
import DeliveryView from './components/DeliveryView';
import Groceries from './components/Groceries';
import InformationForm from './components/InformationForm';
import TakeAway from './components/Takeaway';

function App() {
  const user = useContext(AuthContext);

  useEffect(() => {
    document.body.classList.add('bodyDiv');
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user){
      const userReference = doc(firestore, "users",user.uid);
      const getUser = async() => {
        const data = await getDoc(userReference);
        if (data.exists()){
          if (data.data().hasOwnProperty("admin")){
            if(data.data().admin === true){
              setIsAdmin(true);
              console.log("User is admin");
            }
          }
        }
      }
      getUser();
    }
  }, [user])
  
  return (
      <BrowserRouter basename='/'>
        <ScrollToTop/>
        <Navbar />
          <div className='main'>
              <Routes>

                <Route path='/' element={<Home />}/>

                <Route
                  path='/login'
                  element={
                    <ProtectedRoute>
                      <SmallLogin />
                    </ProtectedRoute>
                  }
                />

                <Route path='/register' element={<ProtectedRoute><SmallRegistration/></ProtectedRoute>}/>

                <Route path='/OrderConfirmation' element={<OneOrderConfirmation/>}/>

                <Route path='/profile' element={<ProfilePage isAdmin = {isAdmin}/>}/>

                <Route path='/terms-and-conditions' element={<TermsAndConditions/>}/>

                <Route path="/offers" element={<DeliveryView></DeliveryView>}/>

                <Route path='/dagligvarer' element={<Groceries/>}/>

                <Route path='/takeaway' element={<TakeAway/>}/>
                
                <Route path='/ContactInfo' element={<InformationForm/>}/>

              </Routes>
          </div>
        <Footer />
      </BrowserRouter>
  );
}


export default App;
