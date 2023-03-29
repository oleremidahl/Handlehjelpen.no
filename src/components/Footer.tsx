import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const Footer = () => {
    return(
        <div style={{backgroundColor: 'rgb(157, 157, 157)', width: '100%', paddingBottom: '30px'}}>

            <div className="footer">
                <div className="ToS">
                    <h2>HANDLEHJELPEN</h2>
                    <Link to="/terms-and-conditions" style={{color: 'black'}}>
                        <p style={{color: 'black'}}>Betingelser og Vilkår</p>
                    </Link>
                    {/* <p>©kultnavn - Alle rettigheter reservert</p> */}
                </div>
                <div className="footInfo">
                    <div className="contact">
                        <h3>Kontakt Oss</h3>
                        <p><ContactMailIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>kontakt@handlehjelpen.no</p>
                        <p><ContactPhoneIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>Tlf: 489 12 203</p>
                    </div>
                    <div className="follow">
                        <h3>Følg Oss</h3>

                        <p>
                            <a 
                            href="https://www.facebook.com/profile.php?id=100090700042603" 
                            target="_blank" rel="noopener noreferrer" 
                            style={{color: 'black', marginTop: '-10px'}}>
                            <FacebookIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>
                            Facebook
                            </a>
                        </p>
                    
                        <p>
                            <a 
                            href="https://www.instagram.com/handlehjelpen.no/" 
                            target="_blank" rel="noopener noreferrer" 
                            style={{color: 'black'}}>
                            <InstagramIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>
                            Instagram
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Laget av: Ole Remi Dahl</p>
                <a
                href="https://github.com/oleremidahl"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black" }}
                >
                <GitHubIcon sx={{marginRight: '10px', marginBottom: '-6px'}}/>
                Github
                </a>
            </div>
        </div>
    )
}

export default Footer;