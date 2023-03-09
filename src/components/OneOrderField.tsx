import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/product_card.css";
import "../css/AI/AI_OrderField.css";
import GoogleMapComponent from "./GoogleMapComponent";
import { AuthContext } from "../context/AuthContext";
import { firestore } from "../base";
import { addDoc, collection, doc, DocumentReference, getDoc } from "firebase/firestore";
import Calendar from './Calendar';

const OneOrderField = () => {
    
    const navigate = useNavigate();
    const user = useContext(AuthContext);
    const [inpGoods, setInpGoods] = useState("");
    const [inpName, setInpName] = useState("");
    const [inpTlf, setInpTlf] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [formattedAdress, setFormattedAdress] = useState<string>('');
    const [deliveryPrice, setDeliveryPrice] = useState<number>();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [differentDateTime, setDifferentDateTime] = useState<string>('');
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [items, setItems] = useState<string[]>([]);
  
    
    const baseMessage: string = "NY ORDRE! \n" +  "Navn: " + inpName + "\nTlf: " + inpTlf;
    const dateMessage: string = `\nDato: ${selectedDate !== '' ? selectedDate + "\nTid: " + differentDateTime : "Idag" + "\nTid: " + selectedTime}`;
    const addressMessage: string = `\nLeveres til: ${formattedAdress !== '' ? formattedAdress + "\nTilleggsinfo: " + additionalInfo : additionalInfo}`;
    const priceMessage: string = `\nLeveringspris: ${deliveryPrice ? deliveryPrice + " kr" : "Ikke estimert, må regnes ut manuelt."}`
    const itemsMessage: string = `\nBestilling:\n${items.join('\n')}`;
    const phoneNumbers: string[] = ['+4741398911', '+4741289478']
    
    
    useEffect(() => {
        if (user) {
            const userReference = collection(firestore, "users");
            const getNameAndPhone = async () => {
            const docRef = doc(userReference, user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setInpName(data.navn);
                setInpTlf(data.tlf);
        } else {
            console.log("No such document!");
        }
        };
        getNameAndPhone();
    }
    }, [user]);

    const [timeOfDay, setTimeOfDay] = useState(new Date().getHours());
    const [options, setOptions] = useState([
        { value: 'ASAP', label: 'Så fort som mulig (normalt innen 60 min)' },
        { value: 'Før 09:00', label: 'Før 09:00' },
        { value: '09:00-11:00', label: '09:00-11:00' },
        { value: '11:00-13:00', label: '11:00-13:00' },
        { value: '13:00-15:00', label: '13:00-15:00' },
        { value: '15:00-17:00', label: '15:00-17:00' },
        { value: '17:00-19:00', label: '17:00-19:00' },
        { value: '19:00-21:00', label: '19:00-21:00' },
        { value: '21:00-23:00', label: '21:00-23:00' },
        { value: 'En annen dato', label: 'En annen dato' },
    ]);
    const [updatedOptions, setUpdatedOptions] = useState([ 
        { value: 'ASAP', label: 'Så fort som mulig (normalt innen 60 min)' },
        { value: 'Før 09:00', label: 'Før 09:00' }]);

  useEffect(() => {
    const updateOptions = options.filter(option => {
      if (option.value === 'ASAP' && timeOfDay < 22 && timeOfDay > 7) {
        return true;
      }

      if (option.value === 'Før 09:00') {
        return timeOfDay < 8;
      }

      if (option.value.includes('-')) {
        const startTime = parseInt(option.value.split('-')[0].split(':')[0]);
        return startTime - 1> timeOfDay;
      }

      if (option.value === 'En annen dato') {
        return true;
      }

      return false;
    });

    setUpdatedOptions(updateOptions);
    if (!selectedTime && updateOptions.length > 0) {
        setSelectedTime(updateOptions[0].value);
      }
  }, [timeOfDay, options]);


    
    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };
    
    const handleAdd = (good: string) => {
        if (good !== ""){
            const newItems = [...items];
            newItems.push(good);
            setItems(newItems);
            setInpGoods("");
        }
    };

    const handleKeydown = (event:  {key: string;} ) =>  {
        if (event.key === 'Enter'){
            handleAdd(inpGoods)
        }
    }

    const handleOrder = (event: any) => {
        event.preventDefault();
        var today = new Date();
        var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var dateTime =   date + '-' + today.getHours() + ":" + today.getMinutes().toString().padStart(2, '0');
        let levering: number = 0;
        if (deliveryPrice){
            levering = deliveryPrice;
        }
        const fullMessage = baseMessage + dateMessage + addressMessage + priceMessage + itemsMessage;
        if (!isEmptyFields()){
            addToFS({
                navn: inpName,
                tlf: inpTlf,
                varer: items,
                lokasjon: formattedAdress,
                leveringspris: levering,
                leveringstid: selectedTime,
                mottatt: dateTime,
                ekstraInfo: additionalInfo,
                annenDato: selectedDate,
                annenDatoTid: differentDateTime,
                to: phoneNumbers,
                body: fullMessage
            });
            if (newOrder){
                navigate("/OrderConfirmation", {state: {
                    id: orderId, 
                    dato: today,
                    navn: inpName,
                    varer: items,
                    lokasjon: formattedAdress,
                    leveringspris: levering,
                    ekstraInfo: additionalInfo,
                    annenDato: selectedDate,
                    leveringstid: selectedTime,
                    annenDatoTid: differentDateTime,
                }});
            }
            else {
                alert("Det oppstod en feil innsending av bestillingen. Prøv gjerne å sende inn på nytt! Om problemet vedvarer kan du bestille ved å ringe eller sende melding til oss på tlf: 413 98 911 eller 412 89 478 ")

            }
        }
    }

    const handleRetrievedVariables = (selectedL: any, selectedOp: string, _formattedAdress: string, distancePrice: number) => {
        setSelectedLocation(selectedL);
        setSelectedMethod(selectedOp);
        setFormattedAdress(_formattedAdress);
        if (distancePrice !== undefined){
            setDeliveryPrice(distancePrice);
        }
        console.log('Location lat lng: ', selectedLocation);
        console.log('Method', selectedMethod);
        console.log('address: ', formattedAdress);
        console.log('price: ', deliveryPrice);
    }

    function isEmptyFields() {
        if(items.length === 0){
            alert('Legg til en bestilling!');
            return true;
        }
        // else if(selectedLocation === null && additionalInfo.length === 0){
        //     alert('Du må enten finne lokasjonen din på kartet eller skrive den inn i det nederste feltet.');
        //     return true;
        // }
        // else if(inpName === '') {
        //     alert('Vennligst fyll inn navnet ditt!');
        //     return true;
        // }
        // else if(inpTlf === '') {
        //     alert('Vennligst fyll inn telefonnummer!');
        //     return true;
        // }
        // else if(selectedTime === 'En annen dato' && (selectedDate === '' || differentDateTime === '')){
        //     alert('Ved levering på en annen dato må du velge både dato og tid.');
        //     return true; 
        // }
        return false;
    }

    // FIRESTORE
    let orderId: string; 
    let newOrder: DocumentReference | undefined;
    const addToFS = async(orderData: Object) => {
        
        const orderReference = collection(firestore, "orders");
        newOrder = await addDoc(orderReference, {...orderData});
        orderId = newOrder.id;
        console.log('Id in orderfield:   ', orderId);
        
        }
    

    // Date Picker
    const handleRetrievedDate = (selectedDate: string) => {
        setSelectedDate(selectedDate);
    }

    // // Inputs
    // const handleNameChange = (event: any) => {
    //     setInpName(event.target.value)
    //     runRetrieved = true
    // }

    return (
        <div className="OrderForm">
            <div className="OrderDetails">
                <h1>Legg inn din ordre her</h1>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <textarea 
                name="varer"
                placeholder="Her kan du legge inn hva du vil ha, det kan for eksempel være dagligvarer eller noe fra en av våre andre samarbeidspartnere"
                onChange={event => setInpGoods(event.target.value)} 
                value = {inpGoods}
                onKeyDown = {handleKeydown}
                >
                </textarea>
                <br/><br/>
                <button className="submitBtn" onClick={() => handleAdd(inpGoods)}>Legg til</button> <br/>
                <div className="OrderView">
                <h3>Din ordre:</h3>
                <ul>
                    {items.map((item, index) => (
                    <li key={index} style={{marginTop: '15px'}}>
                        {item}
                        <button className="listBtn" onClick={() => handleRemove(index)}>X</button>
                    </li>
                    ))}
                </ul>
            </div>
                <hr/>
                <h3>Levering</h3>
                <p>Marker på kartet hvor du ønsker leveringen, du kan også bruke knappen under til å finne din nåværende posisjon. 
                    <br/>(Merk at den ikke vil finne din posisjon om du befinner deg utenfor vårt leveringsområde.) Om kartet ikke fungerer kan du bruke feltet under. 
                </p>
                <GoogleMapComponent onRetrievedVariables={handleRetrievedVariables}></GoogleMapComponent>
                {deliveryPrice && <p>Pris for levering: {deliveryPrice} kr</p>}
                <p style={{marginBottom: '10px'}}>Leveringstid: </p>
                <div className='select'>
                    <select onChange={event => setSelectedTime(event.target.value) }value = {selectedTime}>
                        {updatedOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                    </select>
                    <div className="select__arrow"></div>
                </div>
                {selectedTime === "En annen dato" && (
                    <>
                        <br/><br/>
                        <Calendar onRetrievedDate={handleRetrievedDate}/>
                        <div className="select">
                            <select onChange={event => setDifferentDateTime(event.target.value)}>
                            {options.map(option => {
                                if (option.value !== "En annen dato" && option.value !== "ASAP" 
                                    && option.value !== "21:00-23:00" && option.value !== "19:00-21:00" &&
                                    option.value !== "17:00-19:00") {
                                    return (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                    );
                                }
                                })}
                            </select>
                            <div className="select__arrow"></div>
                        </div>
                    </>
                )}

                <hr/>
                <h3>Kontakt informasjon</h3>
                <form onSubmit={handleOrder}>
                    <input onChange={event => {setInpName(event.target.value)}} type='text' placeholder="Navn" required value={inpName}></input>
                    <input onChange={event => setInpTlf(event.target.value)} type='tel' pattern="^(\+\d{2})?\d{8}$" placeholder="Tlf" required value={inpTlf}></input>
                    <p><span style={{fontWeight: 'bold'}}>Valgfritt:</span> Nyttig info som kan hjelpe oss med leveringen, f.eks kjennetegn som farge på hus eller hytte. 
                    <br/>Du kan også bruke dette feltet om kartet ikke fungerer.
                    </p>
                    <textarea 
                    className="additionalInfo"
                    onChange={event => setAdditionalInfo(event.target.value)}
                    value = {additionalInfo}
                    ></textarea><br/>
                    <button className="submitBtn" type="submit">Send inn bestilling</button>
                </form>
            </div>
        </div>
    );
};

export default OneOrderField;
