import { Button } from "@mui/material";
import { DataSnapshot, get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, database } from "../base";
import ProductCard from "../components/ProductCard";
import SubOrderField from "../components/SubOrderField";
import "../css/home.css";


const Home = ({isLoggedIn, data} : {isLoggedIn : boolean, data: any | null}) => {
    const subscriptionInfo = `Et fantastisk bra avsnitt med 
    gode argumenter for hvorfor denne ordningen er
    det beste siden hjulet ble oppfunnet.`
    
    const oneTimeInfo = `Dette er noe annet men fortsatt 
    en ekstremt god deal for deg som vil ha dette!`

    const [isSubscribed, setIsSubscibed] = useState(false)

    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();

    useEffect(() => {
        if (data){
            if (data.val().abonnement){
                var parts = data.val().abonnement.AbonnementSlutt.split('-');
                var today = new Date();
                var end = new Date(parts[0], parts[1] - 1, parts[2]);
                if (end > today) setIsSubscibed(true);
            }
        }
    })

      return (
        <>
        {(hours >= 7 && hours < 24) || (hours === 23 && minutes === 0) ? 
        <div style={{minWidth: '400px',  marginBottom: '20px', marginLeft: '10%', marginTop: '25px', display: 'flex', flexDirection: 'row'}}>
            <div style={{paddingRight: '10px', height: '100%', marginBottom: '20px'}}>
                <ProductCard
                    title = "Engangskjøp"
                    info = {oneTimeInfo}
                    price = 'kr 6666'
                    image = ""
                    link = "/OneOrder"
                    isLoggedIn = {null}
                ></ProductCard>
            </div>
            {/* {isSubscribed ? 
            <hr style={{border: 'none', borderLeft: '2px solid red', height: '100%', transform: 'rotate(90deg)'}}/>
            :
        <></> */}
            {/* } */}
            <div style={{ marginLeft: '20px', borderLeft: isSubscribed ? '1px black' : 'none'}}>
                {isLoggedIn && isSubscribed?
                    <SubOrderField></SubOrderField>
                    :
                    <ProductCard 
                    title = "Abonnement"
                    info = {subscriptionInfo}
                    price = 'kr 9999'
                    image = "https://sc01.alicdn.com/kf/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3/200006212/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3.jpg"
                    link = "/SubPayment"
                    isLoggedIn = {isLoggedIn}
                    ></ProductCard>
                }
            </div>
        </div>
            :
            
        <div className="product_card" style={{margin: 'auto', marginTop: '30px', padding: '10px'}}>
            <h1>Vi har dessverre stengt</h1>
            <p>Våre åpningstider alle dager: 07:00-23:00</p>
            <p>Du kan fortsatt kjøpe abonnement ved å klikke "Abonnement", så kan du legge inn bestilling når vi åpner igjen. </p>
        </div>
          }
        </>  
        )
}; 

export default Home;