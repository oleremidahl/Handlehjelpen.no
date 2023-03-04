import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SmallLoginStyles.css';
import { AuthContext } from '../context/AuthContext';
import { auth, firestore } from '../base';
import { collection, doc, setDoc } from 'firebase/firestore';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  var user = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        await auth.createUserWithEmailAndPassword(
          email,
          password
        ).then((user) => {
          if (user.user){
            addToDatabase({
              uid: user.user.uid,
              navn: name, 
              email: email,
              tlf: phone,
            })
          }
        });
        navigate("/");
      } catch (error: any) {
        if (error.code === 'auth/weak-password') {
          alert('Passordet må være minst 6 tegn!');
        }
        else if (error.code === 'auth/email-already-in-use') {
          alert('Denne emailen er allerede i bruk.');
        }
        else if (error.code === 'auth/network-request-failed') {
          alert('En nettverksfeil oppstod. Sjekk tilkoblingen din og prøv igjen. ');
        }
        else {
          alert("Det oppstod et problem med opprettelsen av en ny bruker.");
        }
      }
  };

    //FIRESTORE
    const addToDatabase = async(userData: any) => {
        let userReference = collection(firestore,'users');
        await setDoc(doc(userReference, userData.uid), {
          navn: userData.navn,
          email: userData.email,
          tlf: userData.tlf,
        });
      }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Registrer deg</h2>
        <label htmlFor="name">Navn:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <label htmlFor="phone">Tlf:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
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
        <button type="submit">Registrer bruker</button>
        <p>Har du allerede bruker? <Link to="/login">Klikk her!</Link></p>
      </form>
    </div>
  );
};

export default RegistrationForm;
