import { ref, update } from "firebase/database";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../base";

const SubPayment = (props: any) => {
    const [isSubscribed, setIsSubscribed] = useState(false); 
    props = isSubscribed;
    const navigate = useNavigate();
    const handlePayment = () => {
        // await payment complete from Stripe
        var today = new Date();
        var subEnd = new Date(today.setDate(today.getDate() + 7));
        var subEnd_format = subEnd.getFullYear() + '-' + (subEnd.getMonth() + 1) + '-' + subEnd.getDate();
        update(ref(database, 'brukere/' + auth.currentUser?.uid + '/abonnement'), {
            AbonnementSlutt: subEnd_format,
        });
        setIsSubscribed(true);
        navigate("/");
    }

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Fullfør betalingen</h1>
            <button onClick={handlePayment}>Betal</button>
        </div>
    )
}

export default SubPayment;