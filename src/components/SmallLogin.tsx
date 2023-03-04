import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SmallLoginStyles.css';
import { AuthContext } from '../context/AuthContext';
import { auth, firestore } from '../base';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  var user = useContext(AuthContext);
  const navigate = useNavigate();


  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!user){
        try {
          await auth.signInWithEmailAndPassword(
            email,
            password
          );
          navigate("/");
  
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
              alert('Denne kombinasjonen er ikke assosiert med en bruker.');
            }
            else if (error.code === 'auth/wrong-password') {
              alert('Feil passord.');
            }
            else if (error.code === 'auth/invalid-email') {
              alert('Feil email.');
            }
            else if (error.code === 'auth/network-request-failed') {
              alert('En nettverksfeil oppstod. Sjekk tilkoblingen din og prøv igjen. ');
            }
            else {
              alert("Det oppstod et problem med å logge inn. Vennligst prøv på nytt!");
            }
          }
        }
        else {
          alert('Du er allerede logget inn!');
          navigate("/");
        }  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Logg inn</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Passord:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Logg inn</button>
        <p>Har du ikke bruker? <Link to="/register">Klikk her!</Link></p>
      </form>
    </div>
  );
};

export default LoginForm;
