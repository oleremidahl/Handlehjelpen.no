import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set } from "firebase/database";
import { auth } from '../base';
import "../css/AI/Ai_login.css";
import { database } from '../base';
import { AuthContext } from '../context/AuthContext';

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
    
      const createAccount = async () => {
        try {
          await auth.createUserWithEmailAndPassword(
            credentials.regMail,
            credentials.regPsw
          );
          set(ref(database, 'brukere/' + auth.currentUser?.uid), {
            Navn: credentials.regName, 
            Email: credentials.regMail,
            Tlf: credentials.tlf,
          }
          
          )
          navigate("/");
        } catch (error) {
          console.error(error);
        }
      };
      
      const logIn = async () => {
        if(!user){
          try {
            await auth.signInWithEmailAndPassword(
              credentials.loginMail,
              credentials.loginPsw
            );
            navigate("/");
  
          } catch (error) {
            console.error(error);
          }
        }
        else {
          alert('Du er allerede logget inn!');
        }
      };
      


    return (
        <div className={isActive ? 'container right-panel-active' : 'container'} >
            <div className="form-container sign-in-container">
                <h1>Logg Inn</h1>
                <input type="email" name="loginMail" onChange={handleChange} placeholder="Email" id="loginMail"/>
                <input type="password" name="loginPsw" onChange={handleChange} placeholder="Passord" id="loginPassword"/>
                {/* <a>Glemt passord?</a>  */}
                <button className="loginformbutton" id="logIn" onClick={logIn}>Logg Inn</button>
    ¨       </div>
    
            <div className="form-container sign-up-container">
                <h1>Lag Bruker</h1>
                <input type="text" name="regName" onChange={handleChange} placeholder="Navn" id="regName"/>
                <input type="phone" name="tlf" onChange={handleChange} placeholder="Tlf" id="tlf"/>
                <input type="email" name="regMail" onChange={handleChange} placeholder="Email" id="regMail"/>
                <input type="password" name="regPsw" onChange={handleChange} placeholder="Passord" id="regPassword"/>
                <button className="loginformbutton" id="register" onClick={createAccount}>Registrer Deg</button>
            </div>

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