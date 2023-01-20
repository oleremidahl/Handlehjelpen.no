import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({isLoggedIn, data} : {isLoggedIn : boolean, data: any | null}) => {
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
    },[])

    return (
        <div className="userProfile">
            {data?
                    <>
                    <h1>Brukerinfo</h1>
                    <p><b>Navn:</b> {data.val().Navn}</p>
                    <p><b>E-mail:</b> {data.val().Email}</p>
                    <p><b>Bruker-ID:</b> {data.key}</p>
                    {/* <p>{data.val().Navn}</p> */}
                    {isSubscribed?
                        
                        <p>Abonnementet ditt utløper {
                            // get(ref(database, 'brukere/' + auth.currentUser?.uid + '/abonnement'))
                            data.val().abonnement.AbonnementSlutt
                            }</p>
                        :
                        <p>Du har for øyeblikket ikke et aktivt abonnement.</p>

                    }</>: <p>Logget ut</p>}
        </div>
    )
}

export default ProfilePage;