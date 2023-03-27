import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";

const Footer = () => {
    return(
        <div className="footer">
            <div style={{marginLeft:'20px', marginTop: '30px'}}>
                <h2>HANDLEHJELPEN</h2>
                <Link to="/terms-and-conditions">
                    <p>Betingelser og Vilkår</p>
                </Link>
                {/* <p>©kultnavn - Alle rettigheter reservert</p> */}
            </div>
            <div className="footInfo">
                <div className="contact">
                    <h3>Kontakt Oss</h3>
                    <p>kontakt@handlehjelpen.no</p>
                    <p>Tlf: 489 12 203</p>
                </div>
                <div>
                    <h3>Følg Oss</h3>
                    <p><a href="https://www.facebook.com/profile.php?id=100090700042603" target="_blank" rel="noopener noreferrer">Facebook</a></p>
                    <p><a href="https://www.instagram.com/handlehjelpen.no/" target="_blank" rel="noopener noreferrer">Instagram</a></p>
                </div>
            </div>
        </div>
    )
}

export default Footer;