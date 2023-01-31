import { onValue, ref, update } from "firebase/database";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../base";
import "../css/product_card.css";
import GoogleMapComponent from "./GoogleMapComponent";

const OneOrderField = ({user} : {user: any | null}) => {
    
    const [location, setLocation] = useState("");

    const [inpGoods, setInpGoods] = useState("");

    const [inpName, setInpName] = useState("");
    const [inpTlf, setInpTlf] = useState("");
    let namePath = ref(database, 'brukere/' + auth.currentUser?.uid + '/Navn');
    let phonePath = ref(database, 'brukere/' + auth.currentUser?.uid + '/Tlf');

    useEffect(() => {
        if (user){
            onValue(namePath, (snapshot) => {
                if (snapshot.exists()){
                    setInpName(snapshot.val())
                }
                });
            onValue(phonePath, (snapshot) => {
                if (snapshot.exists()){
                    setInpTlf(snapshot.val())
                }
                });
        }
    }, [])


    const [additionalInfo, setAdditionalInfo] = useState("");

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
        }
        else if (user){
            update(ref(database, 'brukere/' + auth.currentUser?.uid + '/bestillinger/engangs/' + date), {
                Varer: items,
                Lokasjon: location,
                Navn: inpName,
            });
            navigate("/OrderConfirmation", {state: {varer: items, lokasjon: location, navn: inpName, dato: today}});
        }
        else {
            update(ref(database, 'ikkeLoggetInn/bestillinger/' + dateTime + "-" + inpName), {
                Varer: items,
                Lokasjon: location,
            })
            navigate("/OrderConfirmation", {state: {varer: items, lokasjon: location, navn: inpName, dato: today}});
        }
    }

    // function isEmptyFields() {
    //     if (inpName === "" || location === ""){
    //         return true;
    //     }
    //     return false;
    // }
    var selectedLocation: any = null;
    var selectedOption: string = '';
    
    const handleRetrievedVariables = (selectedL: any, selectedOp: string) => {
        selectedLocation = selectedL;
        selectedOption = selectedOp;
    }

    // const [isEmptyFields, setIsEmptyFields] = useState<boolean>(true);

    function isEmptyFields() {
        if(items.length === 0){
            alert('Bestillingen din er tom!');
            return true;
        }
        
        else if (selectedOption === ''){
            alert('Velg en transportmetode!');
            return true;
        }

        else if(selectedLocation === null && additionalInfo.length === 0){
            alert('Du må enten finne lokasjonen din på kartet eller skrive den inn i det nederste feltet.');
            return true;
        }
        return false;
    }

    return (
        <div style={{minWidth: '400px', width: '80%', marginBottom: '20px', marginLeft: '10%', marginTop: '25px', display: 'flex', flexDirection: 'row'}}>
            <div style={{float: 'left', borderRight: '1px solid black', paddingRight: '10px', height: '100%', marginBottom: '20px'}}>
                <h1 style={{marginTop: '15px'}}>Legg inn din ordre her</h1>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <textarea 
                style={{width: '90%', height: '70px', resize: 'none', overflowY: 'scroll', padding: '3px', fontFamily: 'sans-serif'}}
                name="varer"
                placeholder="Her kan du legge inn hva du vil ha, det kan for eksempel være dagligvarer eller noe fra en av våre andre samarbeidspartnere"
                onChange={event => setInpGoods(event.target.value)} 
                value = {inpGoods}
                onKeyDown = {handleKeydown}
                >
                </textarea>
                <br/>
                <button className="submitBtn" onClick={() => handleAdd(inpGoods)}>Legg til</button> <br/>
                <hr/>
                <input style={{background: 'white', border: 'thin solid black', width: '66%'}} onChange={event => setInpName(event.target.value)} placeholder="Navn" value={inpName}></input>
                <input style={{background: 'white', border: 'thin solid black', width: '66%'}} onChange={event => setInpTlf(event.target.value)} placeholder="Tlf" value={inpTlf}></input>
                <p style={{fontWeight: 'bold'}}>Hvor vil du ha det levert? </p>
                <p>Marker på kartet hvor du ønsker leveringen, du kan også bruke knappen under til å finne din nåværende posisjon. 
                    <br/>(Merk at den ikke vil finne din posisjon om du befinner deg utenfor vårt leveringsområde.) Om kartet ikke fungerer kan du bruke feltet under. 
                </p>
                <GoogleMapComponent onRetrievedVariables={handleRetrievedVariables}></GoogleMapComponent>
                <p>Valgfritt: Nyttig info som kan hjelpe oss med leveringen, f.eks kjennetegn som farge på hytta eller båten. 
                <br/>Du kan også bruke dette feltet om kartet ikke fungerer.
                </p>
                <textarea 
                className="additionalInfo"
                onChange={event => setAdditionalInfo(event.target.value)}
                value = {additionalInfo}
                ></textarea><br/>
                <button className="submitBtn" onClick={handleOrder}>Send inn bestilling</button>
            </div>
            <div style={{float: 'right', marginLeft: '20px', width: '40%'}}>
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
