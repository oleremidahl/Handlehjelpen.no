import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SmallLoginStyles.css';
import { AuthContext } from '../context/AuthContext';
import { auth, firestore } from '../base';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Checkbox } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  var user = useContext(AuthContext);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isChecked){
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
            alert('Passordet må være minst 6 tegn.');
          }
          else if (error.code === 'auth/email-already-in-use') {
            alert('Denne emailen er allerede i bruk.');
          }
          else if (error.code === 'auth/invalid-email') {
            alert('Denne emailen er ikke gyldig.');
          }
          else if (error.code === 'auth/network-request-failed') {
            alert('En nettverksfeil oppstod. Sjekk tilkoblingen din og prøv igjen. ');
          }
          else {
            alert("Det oppstod et problem med opprettelsen av en ny bruker.");
            console.log(error);
          }
        }
    }
    else {
      alert("Du må bekrefte at du har lest og forstått Vilkårsavtalen.")
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox 
            color='success'
            checked={isChecked}
            onChange={handleCheckboxChange}
          /> 
          <p style={{ marginLeft: '10px' }}>
            Ved å huke av bekrefter du å ha lest og forstått&nbsp;
            <Link to="/terms-and-conditions"><strong style={{ fontStyle: 'italic' }}>
               Vilkårsavtalen</strong>
            </Link>
          </p>
        </div>

          <button type="submit">Registrer bruker</button>
         

        <p>Har du allerede bruker? <Link to="/login"><strong style={{ fontStyle: 'italic' }}>
              Klikk her!</strong></Link></p>
      </form>
    </div>
  );
};

export default RegistrationForm;
