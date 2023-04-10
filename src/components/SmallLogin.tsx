import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SmallLoginStyles.css';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../base';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  var user = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>('');


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
              setAlertDescription('Denne kombinasjonen er ikke assosiert med en bruker.');
              setIsAlertActive(true);
              // alert('Denne kombinasjonen er ikke assosiert med en bruker.');
            } 
            else if (error.code === 'auth/wrong-password') {
              setAlertDescription('Feil passord.');
              setIsAlertActive(true);
              // alert('Feil passord.');
            } 
            else if (error.code === 'auth/invalid-email') {
              setAlertDescription('Feil email.');
              setIsAlertActive(true);
              // alert('Feil email.');
            } 
            else if (error.code === 'auth/network-request-failed') {
              setAlertDescription('En nettverksfeil oppstod. Sjekk tilkoblingen din og prøv igjen.');
              setIsAlertActive(true);
              // alert('En nettverksfeil oppstod. Sjekk tilkoblingen din og prøv igjen. ');
            } 
            else {
              setAlertDescription('Det oppstod et problem med å logge inn. Vennligst prøv på nytt!');
              setIsAlertActive(true);
              // alert("Det oppstod et problem med å logge inn. Vennligst prøv på nytt!");
            }
          }
        }
        else {
          setAlertDescription('Du er allerede logget inn!');
          setIsAlertActive(true);
          // alert('Du er allerede logget inn!');
          navigate("/");
        }  };

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
       <Button type="submit" variant="contained" color='success' style={{maxWidth: '300px'}}>Logg Inn</Button>
        <p>Har du ikke bruker? <Link to="/register">
          <strong style={{ fontStyle: 'italic' }}>
              Klikk her!</strong></Link></p>
      </form>
    </div>
  );
};

export default LoginForm;
