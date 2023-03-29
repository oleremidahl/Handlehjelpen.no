import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/OrderConfirmation.css";

const OneOrderConfirmation = () => {

    const loc = useLocation();
    const navigate = useNavigate();
    
    const daysOfWeek = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];

    const today = loc.state.dato;
    const formattedToday = today.getDay() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const month = months[today.getMonth()];
    const date = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes().toString().padStart(2, '0');

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
                    <ol >
                        {loc.state.varer.map((item: string) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ol>
                    <p>Leveres til: {(loc.state.lokasjon !== "" ? loc.state.lokasjon : loc.state.ekstraInfo)} <br/>
                        Dato: {(loc.state.annenDato !== "" ? loc.state.annenDato : formattedToday)} <br/>
                        Tid: {(loc.state.annenDatoTid !== "" ? loc.state.annenDatoTid : loc.state.leveringstid)}
                    </p>
                </div>
                <div style={{borderTop: '1px solid black'}}>
                    <p>Pris levering: {loc.state.leveringspris !== 0 ? loc.state.leveringspris + " kr" : "Ikke tilgjengelig"}</p>
                    <p>Merk, prisen på varer kommer i tillegg. </p>
                    <button className="submitBtn" onClick={() => {navigate("/")}}>Tilbake til hjemmesiden</button>
                </div>
            </div>
        </>
    )
}
export default OneOrderConfirmation;