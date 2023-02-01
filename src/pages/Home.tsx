import { Button } from "@mui/material";
import { DataSnapshot, get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, database } from "../base";
import ProductCard from "../components/ProductCard";
import "../css/home.css";


const Home = ({isLoggedIn, data} : {isLoggedIn : boolean, data: any | null}) => {
    
      return (
        <>
            <ProductCard/>
        </>

        )
}; 

export default Home;