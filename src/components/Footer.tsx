import React from "react";
import "../css/footer.css";

const Footer = () => {
    return(
        <div className="footer">
            <div style={{marginLeft:'20px'}}>
                <h2>HANDLEHJELPEN</h2>
                {/* <p>©kultnavn - Alle rettigheter reservert</p> */}
            </div>
            <div className="footInfo">
                <div>
                    <h3>Kontakt Oss</h3>
                    <p>mail@handlehjelpen.no</p>
                </div>
                <div>
                    <h3>Følg Oss</h3>
                    <p>Facebook</p>
                    <p>Instagram</p>
                </div>
            </div>
        </div>
    )
}

export default Footer;