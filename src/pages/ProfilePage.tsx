import { doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from '../context/DataContext';
import {firestore} from '../base';

const ProfilePage = () => {
    const [data, setData] = useState<DocumentData>();
    const user = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user){
            const userReference = doc(firestore, "users", user?.uid);
            const getUser = async() => {
                const retrievedData = await getDoc(userReference);
                setData(retrievedData.data())
                // if(retrievedData){
                //     console.log(retrievedData.data().navn)

                // }
            }
            getUser();
        }
    })

    return (
        <div className="userProfile">
            {user?
                <>
                    <h1>Brukerinfo</h1>
                    <p><b>Navn:</b> {data?.navn}</p>
                    <p><b>Tlf:</b> {data?.tlf}</p>
                    <p><b>E-mail:</b> {data?.email}</p>
                    <p><b>Bruker-ID:</b> {user.uid}</p>
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