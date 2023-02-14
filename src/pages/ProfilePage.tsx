import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from '../context/DataContext';

const ProfilePage = () => {
    const [isSubscribed, setIsSubscibed] = useState(false);
    const data = useContext(DataContext);
    const user = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (data){
            if (data.val().abonnement){
                var parts = data.val().abonnement.AbonnementSlutt.split('-');
                var today = new Date();
                var end = new Date(parts[0], parts[1] - 1, parts[2]);
                if (end > today) setIsSubscibed(true);
            }
        }
    },[])

    return (
        <div className="userProfile">
            {(data && user)?
                <>
                    <h1>Brukerinfo</h1>
                    <p><b>Navn:</b> {data.val().Navn}</p>
                    <p><b>E-mail:</b> {data.val().Email}</p>
                    <p><b>Bruker-ID:</b> {data.key}</p>
                    <Link to="/">
                        <button className="submitBtn">Tilbake til hjemmesiden</button>      
                    </Link>

                </> 
                : 
                <>
                    <h1>Logget ut </h1>
                    <Link to="/">
                        <button className="submitBtn">Tilbake til hjemmesiden</button>      
                    </Link>
                </>
            }
        </div>
    )
}

export default ProfilePage;