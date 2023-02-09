import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../base";
import "../css//navbar.css";
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {

    const user = useContext(AuthContext);

    const signOut = async () => {
        await auth.signOut();
    };

    return (
        <div className="navbar">
            <div className="navInfo">
                <Link to="/">
                    <div className="logo"></div>
                </Link>
                {!user ?
                    <div>
                        <Link to="/login">
                            <button className="loginbutton">Logg inn</button>
                        </Link>

                        <Link to="/login">
                            <button className="loginbutton">Registrer</button>
                        </Link>
                    </div>
                    :
                    <div>
                        <Link to="/profile">
                            <button className="loginbutton">Profil</button>
                        </Link>
                        <button className="loginbutton" onClick={signOut}>Logg ut</button>
                    </div>
                }

            </div>

        </div>
    );
};

export default Navbar;