import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/OrderConfirmation.css";
import ThreeStepProgressBar from "./ThreeStepProgressBar";

const OneOrderConfirmation = () => {

    const loc = useLocation();
    const navigate = useNavigate();
    const { formValues, today } = loc.state;

    
    const daysOfWeek = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
    const dayOfWeek = daysOfWeek[today.getDay()];
    const month = months[today.getMonth()];
    const date = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes().toString().padStart(2, '0');

    return (
        <div style={{paddingTop: '30px', marginBottom: '40px'}}>
            <div style={{width: '80%', maxWidth: '600px', margin: 'auto'}}>
                <ThreeStepProgressBar currentStep={3}/> 
            </div>
            <div className="summary">
                <h1>Ordrebekreftelse</h1>
                <p>Takk for din ordre, {formValues.name}</p>
                <p style={{borderBottom: '1px solid black', paddingBottom: '15px'}}>Vi har registrert din ordre, nedenfor finner du kjøpsinformasjon. <br/>
                   Ordren ble mottatt {dayOfWeek}, {date}. {month} kl {hours}:{minutes}
                </p>
                <div>
                    <h3>Din bestilling</h3>
                    <ol >
                        {formValues.varer.map((item: string) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ol>
                    <p>Leveres til: {formValues.address} <br/>
                        Dato: {formValues.dato} <br/>
                        Tid: {formValues.tid}
                    </p>
                </div>
                <div style={{borderTop: '1px solid black'}}>
                    <p>Pris levering: {formValues.price !== 0  ? formValues.price + " kr" : "Ikke tilgjengelig, regnes ut manuelt av sjåfør. "}</p>
                    <p>Merk, prisen på varer kommer i tillegg. </p>
                    <button className="submitBtn" onClick={() => {navigate("/")}}>Tilbake til hjemmesiden</button>
                </div>
            </div>
        </div>
    )
}
export default OneOrderConfirmation;