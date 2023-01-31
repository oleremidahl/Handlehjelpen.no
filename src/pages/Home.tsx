import { Button } from "@mui/material";
import { DataSnapshot, get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, database } from "../base";
import ProductCard from "../components/ProductCard";
import SubOrderField from "../components/SubOrderField";
import "../css/home.css";


const Home = ({isLoggedIn, data} : {isLoggedIn : boolean, data: any | null}) => {
    
    const oneTimeInfo = `Bestill fra restauranter eller dagligvarebutikken. 
    Dagligvarer får du fra den billigste dagligvarekjeden, Rema 1000. 
    Våre andre samarbeidspartnere er Hr.Redaktør, Smoi, Sabi Sushi etc etc etc`

    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();

      return (
        <div>
            <ProductCard
                title = "Bestill levering!"
                info = {oneTimeInfo}
                link = "/OneOrder"
            ></ProductCard>
        </div>

        )
}; 

export default Home;