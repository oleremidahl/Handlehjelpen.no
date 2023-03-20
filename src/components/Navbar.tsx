import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../base";
import "../css/navbar.css";
import { AuthContext } from '../context/AuthContext';
import simpleLogo from '../images/simple_logo.png';
import { Button } from '@mui/material';

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
                        <Link to="/login">
                            <button className="loginbutton">Logg inn / Registrer</button>
                        </Link>
                    </div>
                    :
                    <div>
                        <Link to="/profile">
                            <button className="loginbutton2">Profil</button>
                        </Link>
                        <button className="loginbutton2" onClick={signOut}>Logg ut</button>
                    </div>
                }

            </div>

        </div>
    );
};

export default Navbar;