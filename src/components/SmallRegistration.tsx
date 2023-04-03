import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SmallLoginStyles.css';
import { AuthContext } from '../context/AuthContext';
import { auth, firestore } from '../base';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  var user = useContext(AuthContext);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(true);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>('');

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };
  const handleEmailCheckboxChange = (event: any) => {
    setIsEmailChecked(event.target.checked);
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
                mottaMail: isEmailChecked
              })
              
            }
          });
          navigate("/");
        } catch (error: any) {
            if (error.code === 'auth/weak-password') {
              setAlertDescription('Passordet må være minst 6 tegn.');
              setIsAlertActive(true);
            }
            else if (error.code === 'auth/email-already-in-use') {
              setAlertDescription('Denne emailen er allerede i bruk.');
              setIsAlertActive(true);
            }
            else if (error.code === 'auth/invalid-email') {
              setAlertDescription('Denne emailen er ikke gyldig.');
              setIsAlertActive(true);
            }
            else if (error.code === 'auth/network-request-failed') {
              setAlertDescription('En nettverksfeil oppstod. Sjekk tilkoblingen din og prøv igjen. ');
              setIsAlertActive(true);
            }
            else {
              setAlertDescription('Det oppstod et problem med opprettelsen av en ny bruker.');
              setIsAlertActive(true);
              console.log(error);
            }
          }
      }
      else {
        setAlertDescription('Du må bekrefte at du har lest og forstått Vilkårsavtalen.');
        setIsAlertActive(true);
      }
  };

    //FIRESTORE
    const addToDatabase = async(userData: any) => {
        let userReference = collection(firestore,'users');
        await setDoc(doc(userReference, userData.uid), {
          navn: userData.navn,
          email: userData.email,
          tlf: userData.tlf,
          mottaMail: userData.mottaMail
        });
      }

  return (
    <div className="form-container">
       {isAlertActive &&
            <Dialog open={isAlertActive} 
                    onClose={() => setIsAlertActive(false)} 
                    // PaperProps={{ style: { backgroundColor: 'darkgreen' } }}
                    >
            <DialogTitle>Ouups! Her mangler det noe. </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {alertDescription}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsAlertActive(false)}>OK</Button>
            </DialogActions>
          </Dialog>
            }
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox 
            color='success'
            checked={isEmailChecked}
            onChange={handleEmailCheckboxChange}
          /> 
          <p style={{ marginLeft: '10px' }}>
            Jeg ønsker å motta nyhetsbrev og annen markedsføring via e-post fra Handlehjelpen. 
          </p>
        </div>

          <Button type="submit" variant="contained" color='success' style={{maxWidth: '300px'}}>Registrer bruker</Button>
         

        <p>Har du allerede bruker? <Link to="/login"><strong style={{ fontStyle: 'italic' }}>
              Klikk her!</strong></Link></p>
      </form>
    </div>
  );
};

export default RegistrationForm;
