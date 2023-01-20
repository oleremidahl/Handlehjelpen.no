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
        <div style={{minHeight: '100%', width: '100%', overflow: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '70%', padding: '5%', margin: 'auto', marginTop: '5%'}}>
                <ProductCard
                    title = "Engangskjøp"
                    info = {oneTimeInfo}
                    price = 'kr 6666'
                    image = ""
                    link = "/OneOrder"
                    isLoggedIn = {null}
                ></ProductCard>

                {isLoggedIn && isSubscribed?
                    <div>
                        {/* <p>Abonnementet ditt utløper {
                            // get(ref(database, 'brukere/' + auth.currentUser?.uid + '/abonnement'))
                            data.val().abonnement.AbonnementSlutt
                            }
                        </p> */}
                        {/* <Link to={"/SubOrder"}>
                            <Button>Klikk her for å legge inn morgendagens ordre</Button>
                        </Link>  */}
                        <SubOrderField></SubOrderField>

                    </div>
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
    )
}; 

export default Home;