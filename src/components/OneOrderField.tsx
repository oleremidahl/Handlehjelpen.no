import { ref, update } from "firebase/database";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../base";
import "../css/product_card.css";
// import GMapComp from "./GMapComp";
import GoogleMapComponent from "./GoogleMapComponent";

const OneOrderField = ({user} : {user: any | null}) => {
    
    const [location, setLocation] = useState("");

    const [inpGoods, setInpGoods] = useState("");

    const [inpName, setInpName] = useState("");

    const navigate = useNavigate();

    const [items, setItems] = useState<string[]>([]);
    
    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };
    
    const handleAdd = (good: string) => {
        const newItems = [...items];
        newItems.push(good);
        setItems(newItems);
        setInpGoods("");
    };

    const handleKeydown = (event:  {key: string;} ) =>  {
        if (event.key === 'Enter'){
            handleAdd(inpGoods)
        }
    }


    const handleOrder = () => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var dateTime = date + '-' + today.getHours() + ":" + today.getMinutes();
        if (isEmptyFields()){
            alert("Vennligst fyll inn alle felt!");
        }
        if (items.length === 0) {
            alert("Ordren din er tom!")
        }
        else if (user){
            update(ref(database, 'brukere/' + auth.currentUser?.uid + '/bestillinger/engangs/' + date), {
                Varer: items,
                Lokasjon: location,
                Navn: inpName,
            });
            navigate("/OneOrderConfirmation", {state: {varer: items, lokasjon: location, navn: inpName, dato: today}});
        }
        else {
            update(ref(database, 'ikkeLoggetInn/bestillinger/' + dateTime + "-" + inpName), {
                Varer: items,
                Lokasjon: location,
            })
            navigate("/OneOrderConfirmation", {state: {varer: items, lokasjon: location, navn: inpName, dato: today}});
        }
    }

    function isEmptyFields() {
        if (inpName === "" || location === ""){
            return true;
        }
        return false;
    }

    return (
        <div style={{minWidth: '400px', width: '60%', margin: 'auto', marginTop: '5%', display: 'flex', flexDirection: 'row'}}>
            <div style={{float: 'left', borderRight: '1px solid black', paddingRight: '10px', height: '100%', marginBottom: '20px'}}>
                <h1 style={{marginTop: '15px'}}>Legg inn din ordre her</h1>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <textarea 
                style={{width: '90%', height: '70px', resize: 'none', overflowY: 'scroll'}}
                className="orderArea" 
                name="varer"
                placeholder="Her kan du legge inn hva du vil ha, det kan for eksempel være dagligvarer eller noe fra en av de lokale restaurantene. "
                onChange={event => setInpGoods(event.target.value)} 
                value = {inpGoods}
                onKeyDown = {handleKeydown}
                >
                </textarea>
                <button className="submitBtn" onClick={() => handleAdd(inpGoods)}>Legg til</button> <br/>
                <hr/>
                <input style={{background: 'white', border: 'thin solid black', width: '66%'}} onChange={event => setInpName(event.target.value)} placeholder="Navn" required></input>
                <p style={{fontWeight: 'bold'}}>Hvor vil du ha det levert? </p>
                <GoogleMapComponent></GoogleMapComponent>
                <textarea 
                className="location"
                onChange={event => setLocation(event.target.value)}
                value = {location}
                ></textarea><br/>
                <button className="submitBtn" onClick={handleOrder}>Send inn</button>
            </div>
            <div style={{float: 'right', marginLeft: '20px', width: '40%'}}>
                {/* <img src="https://sc01.alicdn.com/kf/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3/200006212/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3.jpg" alt="Bilde"></img> */}
                <h1 style={{marginTop: '15px'}}>Din ordre</h1>
                <ul style={{textAlign: 'right', width: '50%', listStyleType: 'none'}}>
                    {items.map((item, index) => (
                    <li key={index} style={{marginTop: '15px'}}>
                        {item}
                        <button style={{marginLeft: '5px', verticalAlign: 'right'}} onClick={() => handleRemove(index)}>X</button>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OneOrderField;
