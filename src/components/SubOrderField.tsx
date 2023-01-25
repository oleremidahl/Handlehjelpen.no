import { off, onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { auth, database } from "../base";
import "../css/product_card.css";
import GoogleMapComponent from "./GoogleMapComponent";

const SubOrderField = () => {

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

    const [location, setLocation] = useState("");

    const [inpGoods, setInpGoods] = useState("");

    var hasOrdered: boolean = false;

    const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let month = months[tomorrow.getMonth()];
    let date = tomorrow.getDate();

    let formatDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let path = ref(database, 'brukere/' + auth.currentUser?.uid + '/bestillinger/Abonnement/' + formatDate)
    onValue(path, (snapshot) => {
        hasOrdered = snapshot.exists()
        console.log(snapshot.exists())
        });

    const handleOrder = () => {        
        update(ref(database, 'brukere/' + auth.currentUser?.uid + '/bestillinger/Abonnement/' + formatDate), {
            Varer: items,
            Lokasjon: location,
        });
        setItems([])
        setLocation("")
        setInpGoods("")
    }

    return (
        <div  style={{ padding: '5px 20px', minWidth: '400px', height: '100%', borderLeft: '1px solid black'}}>
                {hasOrdered? 
                <>
                    <p>
                       Flott! Du har lagt inn morgendagens bestilling! <br></br>
                       Dersom du ønsker å endre på bestillingen kan du bare sende inn en ny, oppdatert bestilling. 
                    </p>
                </>
                : 
                <></>
                }
                <h2 style={{marginTop: '15px', marginLeft: 'auto', marginRight: 'auto'}}>Du kan nå legge inn din ordre for {date}. {month}</h2>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <input 
                style={{border: 'thin solid black', borderRadius: '5px', background: 'white', minWidth: '80px', width: '50%'}}
                // className="orderArea" 
                name="varer"
                placeholder="Legg til én og én vare her"
                onChange={event => setInpGoods(event.target.value)} 
                value={inpGoods}
                onKeyDown={handleKeydown}>
                </input>
                {/* <button className="submitBtn" onClick={addToList2}>Legg til vare</button>
                <ul>
                    {goodsList.map((good) => 
                        <div>
                            <li>{good}<button style={{marginLeft: '5px'}} onClick={removeFromList(good)}>X</button></li>
                        </div>
                    )}
                </ul> */}
                <button className="submitBtn" style={{marginLeft: '5px'}} onClick={() => handleAdd(inpGoods)}>Legg til vare</button>
                <ul style={{textAlign: 'right', width: '50%', listStyleType: 'none'}}>
                    {items.map((item, index) => (
                    <li key={index}>
                        {item}
                        <button style={{marginLeft: '5px', verticalAlign: 'right'}} onClick={() => handleRemove(index)}>X</button>
                    </li>
                    ))}
                </ul>
                <hr/>
                <p style={{fontWeight: 'bold'}}>Hvor vil du ha det levert? </p>
                <p>Marker på kartet hvor du ønsker leveringen, du kan også bruke knappen under til å finne din nåværende posisjon. 
                    <br/>(Merk at den ikke vil finne din posisjon om du befinner deg utenfor vårt leveringsområde.) Om kartet ikke fungerer kan du bruke feltet under. 
                </p>
                <GoogleMapComponent></GoogleMapComponent>
                <hr/>
                <p>Valgfritt: Nyttig info som kan hjelpe oss med leveringen, f.eks kjennetegn som farge på hytta eller båten. 
                <br/>Du kan også bruke dette feltet om kartet ikke fungerer.
                </p>
                <textarea 
                className="location"
                onChange={event => setLocation(event.target.value)}
                value = {location}
                ></textarea>
                <br></br>
                <button className="submitBtn" onClick={handleOrder}> Send inn </button>
                
            </div>
    )
}

export default SubOrderField;