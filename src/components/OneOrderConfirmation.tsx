import { collection, doc, DocumentData, getDoc, QueryDocumentSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../base";
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
    const minutes = today.getMinutes();

    // const [order, setOrder] = useState<DocumentData>();
    
    // useEffect(() => {
    //     const orderReference = doc(firestore, 'orders/' + loc.state.id);
    //     const getOrders = async() => {
    //         const retrievedOrder = await getDoc(orderReference).then(function(doc) {
    //             if (doc.exists()){
    //             setOrder(doc.data());
    //         }
    //         });
    //         console.log("Id:     ",loc.state.id)
            
    //     }
    //     getOrders();
    //     console.log("ORDER:      ",order);
    // }, []);

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
                    {/* 
                        Bruksvilkår og sånn legal shit
                    */}
                </div>
            </div>
        </>
    )
}
export default OneOrderConfirmation;