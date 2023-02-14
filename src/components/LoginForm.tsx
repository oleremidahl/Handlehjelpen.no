import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../base';
import "../css/AI/Ai_login.css";
import { AuthContext } from '../context/AuthContext';
import { collection, doc, setDoc } from 'firebase/firestore';

const LoginForm = () => {

    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();  
    const user = useContext(AuthContext);


    const handleClick = () => {
      if(!user){
        setIsActive(current => !current);
      }
      else {
        alert('Du er allerede logget inn!');
      }
    };

    const [credentials, setCredentials] = useState({
        loginMail: "",
        loginPsw: "", 
        regName: "", 
        regMail: "", 
        regPsw: "",
        tlf: ""
    });  
    
    function handleChange(evt: { target: { value: String; name: any; }; } ) {
        const value = evt.target.value;
        setCredentials({
          ...credentials,
          [evt.target.name]: value
        });
      }
    
      const createAccount = async (event: any) => {
        event.preventDefault()
        try {
          await auth.createUserWithEmailAndPassword(
            credentials.regMail,
            credentials.regPsw
          ).then((user) => {
            if (user.user){
              addToDatabase({
                uid: user.user.uid,
                navn: credentials.regName, 
                email: credentials.regMail,
                tlf: credentials.tlf,
              })
            }
          });
          navigate("/");
        } catch (error: any) {
          if (error.code === 'auth/weak-password') {
            alert('Passordet må være minst 6 tegn!');
          }
          else {
            alert("Det oppstod et problem med å opprette bruker.");
          }
        }
      };
      
      const logIn = async (event: any) => {
        event.preventDefault();
        if(!user){
          try {
            await auth.signInWithEmailAndPassword(
              credentials.loginMail,
              credentials.loginPsw
            );
            navigate("/");
  
          } catch (error: any) {
              if (error.code === 'auth/wrong-password') {
                alert('Feil passord.');
              }
              if (error.code === 'auth/invalid-email') {
                alert('Feil email!');
              }
              else {
                alert("Det oppstod et problem med å logge inn.");
              }
            }
          }
          else {
            alert('Du er allerede logget inn!');
          }
    };
    
    //FIRESTORE
    let userReference = collection(firestore,'users');
    const addToDatabase = async(userData: any) => {
      await setDoc(doc(userReference, userData.uid), {
        navn: userData.navn,
        email: userData.email,
        tlf: userData.tlf,
      });
    }


    return (
        <div className={isActive ? 'container right-panel-active' : 'container'} >
            <form onSubmit={logIn} className="form-container sign-in-container">
                <h1>Logg Inn</h1>
                <input type="email" name="loginMail" onChange={handleChange} required placeholder="Email" id="loginMail"/>
                <input type="password" name="loginPsw" onChange={handleChange} required placeholder="Passord" id="loginPassword"/>
                {/* <a>Glemt passord?</a>  */}
                <button className="loginformbutton" id="logIn" type='submit' >Logg Inn</button>
    ¨       </form>
    
            <form onSubmit={createAccount} className="form-container sign-up-container">
                <h1>Lag Bruker</h1>
                <input type="text" name="regName" onChange={handleChange} required placeholder="Navn" id="regName"/>
                <input type="phone" name="tlf" onChange={handleChange} placeholder="Tlf" id="tlf"/>
                <input type="email" name="regMail" onChange={handleChange} required placeholder="Email" id="regMail"/>
                <input type="password" name="regPsw" onChange={handleChange} required placeholder="Passord" id="regPassword"/>
                <button className="loginformbutton" id="register" type='submit'>Registrer Deg</button>
            </form>

            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Velkommen Tilbake!</h1>
                        <p style={{color: '#c6cd03'}}>Logg inn for å en enklere bestilling!</p>
                        <button className="loginformbutton ghost" onClick={handleClick}>Logg Inn</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Hei der!</h1>
                        <p>Fyll inn informasjonen din og registrer deg!</p>
                        <button className="loginformbutton ghost" onClick={handleClick}>Registrer Deg</button>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default LoginForm;