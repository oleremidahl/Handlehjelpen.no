import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/product_card.css";
import "../css/AI/AI_OrderField.css";
import GoogleMapComponent from "./GoogleMapComponent";
import { AuthContext } from "../context/AuthContext";
import { firestore } from "../base";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import Calendar from './Calendar';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const OrderField = () => {
    
    const navigate = useNavigate();
    const user = useContext(AuthContext);
    const [inpGoods, setInpGoods] = useState("");
    const [inpName, setInpName] = useState(localStorage.getItem('inpName') || '');
    const [inpTlf, setInpTlf] = useState(localStorage.getItem('inpTlf') || '');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [formattedAdress, setFormattedAdress] = useState<string>('');
    const [deliveryPrice, setDeliveryPrice] = useState<number>();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [differentDateTime, setDifferentDateTime] = useState<string>('');
    const [additionalInfo, setAdditionalInfo] = useState(localStorage.getItem('additionalInfo') || '');
    const [items, setItems] = useState<string[]>(JSON.parse(localStorage.getItem('items') || '[]'));
    const [isExtraChecked, setIsExtraChecked] = useState(true);
  
    const handleExtraCheckboxChange = (event: any) => {
        setIsExtraChecked(event.target.checked);
    }

    useEffect(() => {
      localStorage.setItem('inpName', inpName);
      localStorage.setItem('inpTlf', inpTlf);
      localStorage.setItem('selectedTime', selectedTime);
    //   localStorage.setItem('selectedDate', selectedDate);
      localStorage.setItem('differentDateTime', differentDateTime);
      localStorage.setItem('additionalInfo', additionalInfo);
      localStorage.setItem('items', JSON.stringify(items));
    }, [inpName, inpTlf, formattedAdress, deliveryPrice, selectedTime, selectedDate, differentDateTime, additionalInfo, items]);
  
    const [isTomorrow, setIsTomorrow] = useState<boolean>();
    const [isOffSeason, setIsOffSeason] = useState<boolean>();
  
    
    const baseMessage: string = "NY ORDRE! \n" +  "Navn: " + inpName + "\nTlf: " + inpTlf;
    const dateMessage: string = `\nDato: ${selectedDate !== '' ? selectedDate + "\nTid: " + differentDateTime : "Idag" + "\nTid: " + selectedTime}`;
    const addressMessage: string = `\nLeveres til: ${formattedAdress !== '' ? formattedAdress + "\nTilleggsinfo: " + additionalInfo : additionalInfo}`;
    const priceMessage: string = `\nLeveringspris: ${deliveryPrice ? deliveryPrice + " kr" : "Ikke estimert, må regnes ut manuelt."}`
    const itemsMessage: string = `\nBestilling:\n${items.join('\n')}`;
    const phoneNumbers: string[] = ['+4748912203'];
    const misingItemsOrder: string = `\n${isExtraChecked ? "Kunden ønsker å få levering selv om noen varer mangler" : "Kunden ønsker IKKE levering om det mangler en vare. "}`
    
    // const [savedDate, setSavedDate] = useState<Date | null>(null)
    const [isChecked, setIsChecked] = useState(false);

    const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
    const [alertDescription, setAlertDescription] = useState<string>('');

    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);
    };
    
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
        { value: 'En annen dato', label: 'En annen dato' },
    ]);
    const [updatedOptions, setUpdatedOptions] = useState([ 
        { value: 'ASAP', label: 'Så fort som mulig (normalt innen 60 min)' },
        { value: 'Før 09:00', label: 'Før 09:00' }]);

  useEffect(() => {
    const today = new Date();
    const updateOptions = options.filter(option => {
        if(today < new Date(2023,3, 3)){
            if (option.value === 'En annen dato'){
                return true;
            }
            else return false;
        }
        else {

            if (option.value === 'ASAP' && timeOfDay < 20 && timeOfDay > 12 ) {
                return true;
            }
            
            else if (option.value === '09:00-11:00' || option.value === '11:00-13:00' ){
                return false;
            }
            
            else if (option.value.includes('-') ) {
                const startTime = parseInt(option.value.split('-')[0].split(':')[0]);
                return startTime - 1 > timeOfDay;
            }
            
            if (option.value === 'En annen dato') {
                return true;
            }
            
            return false;
        }
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

    const removeAll = () => {
        setItems([]);
    }

    const handleKeydown = (event:  {key: string;} ) =>  {
        if (event.key === 'Enter'){
            handleAdd(inpGoods)
        }
    }

    const handleOrder = (event: any) => {
        event.preventDefault();
        var uid = "";
        if (user){
            uid = user.uid
        }
        if (isChecked || user){
            var today = new Date();
            var year = today.getFullYear();
            var month = (today.getMonth() + 1).toString().padStart(2, '0');
            var day = today.getDate().toString().padStart(2, '0');
            var date = year + '/' + month + '/' + day;
            var dateTime =   date + '-' + today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0');
            let levering: number = 0;
            if (deliveryPrice){
                levering = deliveryPrice;
            }
            const fullMessage = baseMessage + dateMessage + addressMessage + priceMessage + itemsMessage + misingItemsOrder;
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
                    body: fullMessage,
                    ownerId: uid,
                    onskerOrdreMedMangler: isExtraChecked
                }).then((newOrder: any) => {
                    // console.log("Order added to Firestore:", newOrder);
                    navigate("/OrderConfirmation", {state: {
                      id: newOrder.id, 
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
                  }).catch((error: any) => {
                    console.error(error);
                    setAlertDescription('Det oppstod en feil innsending av bestillingen. Prøv gjerne å sende inn på nytt! Om problemet vedvarer kan du bestille ved å ringe eller sende melding til oss på tlf: 489 12 203');
                    setIsAlertActive(true);
                    // alert("Det oppstod en feil innsending av bestillingen. Prøv gjerne å sende inn på nytt! Om problemet vedvarer kan du bestille ved å ringe eller sende melding til oss på tlf: 489 12 203 ")
                })}
        }
        else {
            setAlertDescription('Du må bekrefte at du har lest og forstått Vilkårsavtalen.');
            setIsAlertActive(true);
            // alert("Du må bekrefte at du har lest og forstått Vilkårsavtalen.")
        }
    }

    const handleRetrievedVariables = (selectedL: any, _formattedAdress: string, distancePrice: number) => {
        setSelectedLocation(selectedL);
        setFormattedAdress(_formattedAdress);
        if (distancePrice !== undefined){
            setDeliveryPrice(distancePrice);
        }
        // console.log('Distance price: '+distancePrice);
    }
   

    function isEmptyFields() {
        if(items.length === 0){
            setAlertDescription('Legg til en bestilling!');
            setIsAlertActive(true);
            // alert('Legg til en bestilling!');
            return true;
        }
        if (selectedLocation === null && additionalInfo === ''){
            setAlertDescription('Finn en posisjon på kartet eller skriv adressen din i det nederste feltet. ');
            setIsAlertActive(true);
            // alert('Finn en posisjon på kartet eller skriv adressen din i det nederste feltet. ')
            return true;
        }
        if (selectedTime === "En annen dato" && selectedDate === ''){
            setAlertDescription('Du må velge en leveringsdato.');
            setIsAlertActive(true);
            // alert('Du må velge en leveringsdato.');
            return true;
        }
        return false;
    }

    // FIRESTORE
    const addToFS = (orderData: Object) => {
        return new Promise((resolve, reject) => {
          const orderReference = collection(firestore, "orders");
          addDoc(orderReference, {...orderData})
            .then((newOrder: any) => {
            //   console.log("Data added to Firestore:", newOrder);
              resolve(newOrder);
            })
            .catch((error: any) => {
              console.error("Error adding data to Firestore:", error);
              reject(error);
            });
        });
      };
    

    // Date Picker
    const handleRetrievedDate = (selectedDate: Date) => {
        const datestring = selectedDate?.getDate() + '/' + (selectedDate?.getMonth() + 1) + '/' + selectedDate?.getFullYear();
        setSelectedDate(datestring);
        const today = new Date();
        
        if (selectedDate?.getDate() === today.getDate() + 1) setIsTomorrow(true);
        else setIsTomorrow(false);

        const isAfterApril10 = selectedDate >= new Date(selectedDate.getFullYear(), 3, 11);
        const isBeforeJune18 = selectedDate < new Date(selectedDate.getFullYear(), 5, 18);

        if (isAfterApril10 && isBeforeJune18) {
            setIsOffSeason(true);
        } else {
            setIsOffSeason(false);
        }
    }

    return (
        <div className="OrderForm">
            {isAlertActive &&
            <Dialog open={isAlertActive} 
                    onClose={() => setIsAlertActive(false)} 
                    // PaperProps={{ style: { backgroundColor: 'darkgreen' } }}
                    >
            <DialogTitle>Ouups! Her mangler det noe. </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {alertDescription}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsAlertActive(false)}>OK</Button>
            </DialogActions>
          </Dialog>
            }
            <div className="OrderDetails">
                <h1>Ny bestilling</h1>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <textarea 
                name="varer"
                placeholder="Her kan du legge inn det du vil ha, det kan for eksempel være dagligvarer eller noe fra en av byens restauranter."
                onChange={event => setInpGoods(event.target.value)} 
                value = {inpGoods}
                onKeyDown = {handleKeydown}
                >
                </textarea>
                <br/><br/>
                <button className="submitBtn" onClick={() => handleAdd(inpGoods)}>Legg til</button> <br/>
                <div className="OrderView">
                    <h3>Din ordre:</h3>
                    {items.length !== 0 &&
                    <>
                    <button className="submitBtn" style={{float: 'right'}} onClick={removeAll}>Fjern alle</button>
                    <br/><br/>
                    <ul>
                        {items.map((item, index) => (
                        <li key={index} style={{marginTop: '15px'}}>
                            {item}
                            <button className="listBtn" onClick={() => handleRemove(index)}>X</button>
                        </li>
                        ))}
                    </ul>
                    </>
                    }
                </div>
                <hr/>
                <h3>Levering</h3>
                <p>Marker på kartet hvor du ønsker leveringen, du kan også bruke knappen under til å finne din nåværende posisjon. 
                    <br/>(Merk at den ikke vil finne din posisjon om du befinner deg utenfor vårt leveringsområde.) Om kartet ikke fungerer kan du bruke feltet under. 
                </p>
                <GoogleMapComponent onRetrievedVariables={handleRetrievedVariables}></GoogleMapComponent>
                {deliveryPrice && (
                    <p>
                        Pris for levering: {deliveryPrice} kr
                    </p>
                )}

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
                        <Calendar onRetrievedDate={handleRetrievedDate}/><br/>
                        <div className="select">
                            <select onChange={event => setDifferentDateTime(event.target.value)}>
                            {options.map(option => {
                                // console.log('Tomm',isTomorrow)
                                if (isOffSeason){
                                    if (option.value !== "En annen dato" && option.value !== "ASAP" 
                                        && option.value !== "21:00-23:00" && option.value !== "19:00-21:00"
                                        && option.value !== "17:00-19:00" && option.value !== "15:00-17:00"
                                        && option.value !== "13:00-15:00"
                                        )
                                        {
                                        return (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                        );
                                    }
                                }
                                else if (timeOfDay > 18 && isTomorrow){

                                    if (option.value !== "En annen dato" && option.value !== "ASAP" 
                                        && option.value !== "21:00-23:00" && option.value !== "Før 09:00"
                                        && option.value !== "09:00-11:00" && option.value !== "11:00-13:00"
                                        )
                                        {
                                        return (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                        );
                                    }
                                }
                                else {
                                    if (option.value !== "En annen dato" && option.value !== "ASAP" 
                                        && option.value !== "21:00-23:00")
                                        // && option.value !== "19:00-21:00" && option.value !== "17:00-19:00")
                                        {
                                        return (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                        );
                                    }
                                }
                                })}
                            </select>
                            <div className="select__arrow"></div>
                        </div>
                    </>
                )}

                <hr/>
                <h3>Kontakt informasjon</h3>
                <form onSubmit={handleOrder} className="OrderView">
                    <input onChange={event => {setInpName(event.target.value)}} type='text' placeholder="Navn" required value={inpName}></input> <br/>
                    <input onChange={event => setInpTlf(event.target.value)} type='tel' pattern="^(\+\d{2})?\d{8}$" placeholder="Tlf" required value={inpTlf}></input>
                    <p><span style={{fontWeight: 'bold'}}>Valgfritt:</span> Tilleggsinformasjon som kan være nyttig for oss, f.eks allergier eller utdypende veibeskrivelse.  
                    <br/>Du kan også bruke dette feltet om kartet ikke fungerer.
                    </p>
                    <textarea 
                    className="additionalInfo"
                    onChange={event => setAdditionalInfo(event.target.value)}
                    value = {additionalInfo}
                    ></textarea><br/>
                    {!user && 
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox 
                                color='success'
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            /> 
                            <p style={{ marginLeft: '10px' }}>
                                Ved å huke av bekrefter du å ha lest og forstått&nbsp;
                                <Link to="/terms-and-conditions"><strong style={{ fontStyle: 'italic', color: '#333333'}}>
                                Vilkårsavtalen</strong>
                                </Link>
                            </p>
                        </div>}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox 
                        color='success'
                        checked={isExtraChecked}
                        onChange={handleExtraCheckboxChange}
                    /> 
                    <p style={{ marginLeft: '10px' }}>
                        Hvis en eller flere matvarer er utsolgt eller ikke tilgjengelig ønsker jeg fortsatt resten av min bestilling. 
                    </p>
                    </div>
                    <Button type="submit" variant="contained" color='success' style={{maxWidth: '300px'}}>Send inn bestilling</Button>
                </form>
            </div>
        </div>
    );
};

export default OrderField;