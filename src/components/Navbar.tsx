import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../base";
import "../css/navbar.css";

const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => {

    const signOut = async () => {
        await auth.signOut();
    };

    return (
        <div className="navbar">
            <div className="navInfo">
                <Link to="/">
                    <div className="logo"></div>
                </Link>
                <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Link to="/OneOrder">
                        <p style={{paddingRight: '10px', borderRight: '1px solid black'}}>Engangskjøp</p>
                    </Link>

                    <Link to={!isLoggedIn ? "/login" : "/SubPayment"}>
                        <p style={{marginLeft: '10px'}}>Abonnement</p>
                    </Link>
                </div>
                {!isLoggedIn ?
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