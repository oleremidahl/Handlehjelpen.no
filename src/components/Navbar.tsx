import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../base";
import "../css/navbar.css";
import { AuthContext } from '../context/AuthContext';
import simpleLogo from '../images/simple_logo.png';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const Navbar = () => {

    const user = useContext(AuthContext);
    const navigate = useNavigate();

    const signOut = async () => {
        await auth.signOut();
        navigate("/");
    };

    return (
        <div className="navbar">
            <div className="navInfo">
                <Link to="/">
                    <img src={simpleLogo} alt="Logo" style={{width: '80px', marginTop: '10px'}}/>
                </Link>
                {!user ?
                    <div>
                        <Link to="/login" >
                            <button className="loginbutton" style={{display: 'flex', alignItems: 'center'}}><LoginIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/><span>Logg inn / Registrer</span> </button>
                        </Link>
                    </div>
                    :
                    <div>
                        <Link to="/profile">
                            <button className="loginbutton2"><AccountBoxIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>Profil</button>
                        </Link>
                        <button className="loginbutton2" onClick={signOut}><LogoutIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>Logg ut</button>
                    </div>
                }

            </div>

        </div>
    );
};

export default Navbar;