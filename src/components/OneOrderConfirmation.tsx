import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/OrderConfirmation.css";

const OneOrderConfirmation = () => {

    const loc = useLocation();
    const navigate = useNavigate();
    
    const daysOfWeek = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];

    let today = loc.state.dato;
    let dayOfWeek = daysOfWeek[today.getDay()];
    let month = months[today.getMonth()];
    let date = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();
   
    return (
        <>
            <div className="summary">
                <h1>Ordrebekreftelse</h1>
                <p>Takk for din ordre, {loc.state.navn}</p>
                <p style={{borderBottom: '1px solid black', paddingBottom: '15px'}}>Vi har registrert din ordre, nedenfor finner du kjøpsinformasjon. <br/>
                   Ordren ble mottatt {dayOfWeek}, {date}. {month} kl {hours}:{minutes}
                </p>
                <div>
                    <h3>Din bestilling</h3>
                    {/* <p style={{fontStyle: 'italic'}}>"{loc.state.varer}"</p>  */}
                    <ol style={{width: '20%', marginLeft: 'auto', marginRight: 'auto'}}>
                        {loc.state.varer.map((item: string) => (
                            <li>{item}</li>
                        ))}
                    </ol>
                    <p>Leveres til: {loc.state.lokasjon}</p>
                </div>
                <div style={{borderTop: '1px solid black'}}>
                    <p>Pris levering: xxxkr</p>
                    <p>Merk, prisen på varer kommer i tillegg. </p>
                    <button className="submitBtn" onClick={() => {navigate("/")}}>Tilbake til hjemmesiden</button>
                    {/* Må legge til betalingsmåte som ble brukt (kort eller vipps) */}
                    {/* Må få et estimat på leveringstid.
                        Bruksvilkår og sånn legal shit
                    */}
                </div>
            </div>
        </>
    )
}
export default OneOrderConfirmation;