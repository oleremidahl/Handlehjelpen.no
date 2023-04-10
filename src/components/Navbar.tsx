import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../base";
import "../css/navbar.css";
import { AuthContext } from '../context/AuthContext';
import simpleLogo from '../images/simple_logo.png';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const Navbar = () => {

    const user = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const signOut = async () => {
        await auth.signOut();
        navigate("/");
    };

    const handleMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="navbar">
            <div className="navInfo">
                <Link to="/">
                    <img src={simpleLogo} alt="Logo" style={{width: '80px', marginTop: '10px'}}/>
                </Link>
                <p className="navTitle">Handlehjelpen Mandal</p>
                {!user ?
                    <div>
                        <Link to="/login" >
                            <button className="loginbutton" style={{display: 'flex', alignItems: 'center'}}><LoginIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/><span>Logg inn / Registrer</span> </button>
                        </Link>
                    </div>
                    :
                    <div>
                        <button style={{marginTop: '20px', marginRight: '10px'}} onClick={handleMenu}>
                            <MenuIcon />
                        </button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <Link to="/profile">
                                <MenuItem onClick={handleClose}>
                                    <AccountBoxIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>Profil
                                </MenuItem>
                            </Link>
                            <MenuItem onClick={signOut}>
                                <LogoutIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>Logg ut
                            </MenuItem>
                        </Menu>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navbar;
