import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { firestore } from '../base';
import { AuthContext } from '../context/AuthContext';
import Calendar from './Calendar';
import ThreeStepProgressBar from './ThreeStepProgressBar';
import { Loader } from '@googlemaps/js-api-loader';

interface FormValues {
  name: string;
  phone: string;
  additionalInfo?: string;
  varer: string[],
  type: string,
  address?: string,
  price?: number,
  dato: string,
  tid: string,
  extraChecked?: boolean,
}

const InformationForm: React.FC = () => {
    const loc = useLocation();
    const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    phone: '',
    additionalInfo: '',
    varer: loc.state.varer,
    type: loc.state.type,
    address: loc.state.address,
    price: loc.state.price,
    dato: '',
    tid: '',
    extraChecked: loc.state.extraChecked,
  });
  const user = useContext(AuthContext);
  const [isToday, setIsToday] = useState<boolean>();
  const [isTomorrow, setIsTomorrow] = useState<boolean>();
  const [isOffSeason, setIsOffSeason] = useState<boolean>();
  const [timeOfDay, setTimeOfDay] = useState(new Date().getHours());
  const baseMessage: string = "NY ORDRE! \n" +  "Navn: " + formValues.name + "\nTlf: " + formValues.phone;
  const dateMessage: string = `\nDato: ${formValues.dato}, ${formValues.tid}`;
  const addressMessage: string = `\nLeveres til: ${formValues.address}`;
  const priceMessage: string = `\nLeveringspris: ${formValues.price !== 0 ? formValues.price + " kr" : "Ikke estimert, må regnes ut manuelt."}`
  const itemsMessage: string = `\nBestilling:\n${formValues.varer.join('\n')}`;
  const additionalInfoMessage: string = formValues.additionalInfo ? `\nEkstra info: ${formValues.additionalInfo}` : "";
  const phoneNumbers: string[] = ['+4748912203'];
  const misingItemsOrder: string = `\n${formValues.extraChecked ? "Kunden ønsker å få levering selv om noen varer mangler" : "Kunden ønsker IKKE levering om det mangler en vare. "}`
  const navigate = useNavigate();
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>('');

  const [options, setOptions] = useState([
    { value: 'ASAP', label: 'Så fort som mulig (normalt innen 60 min)' },
    { value: 'Før 09:00', label: 'Før 09:00' },
    { value: '09:00-11:00', label: '09:00-11:00' },
    { value: '11:00-13:00', label: '11:00-13:00' },
    { value: '13:00-15:00', label: '13:00-15:00' },
    { value: '15:00-17:00', label: '15:00-17:00' },
    { value: '17:00-19:00', label: '17:00-19:00' },
    { value: '19:00-21:00', label: '19:00-21:00' },
  ]);

    useEffect(() => {
        if (user) {
            const userReference = collection(firestore, "users");
            const getNameAndPhone = async () => {
            const docRef = doc(userReference, user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormValues((prevFormValues) => ({ ...prevFormValues, name: data.navn, phone: data.tlf }));
        } else {
            console.log("No such document!");
        }
        };
        getNameAndPhone();
    }
    }, [user]);

    useEffect(() => {
        const filteredOptions = 
            options.filter(option => {
                if (isToday) {
                    if (option.value === 'ASAP' && timeOfDay < 20 && timeOfDay > 12) {
                        return true;
                    } else if (option.value.includes('-')) {
                        const startTime = parseInt(option.value.split('-')[0].split(':')[0]);
                        return startTime - 1 > timeOfDay;
                    }
                    return false;
                } 
                else if (isOffSeason) {
                    if (
                        option.value !== 'ASAP' &&
                        option.value !== '19:00-21:00' &&
                        option.value !== '17:00-19:00' &&
                        option.value !== '15:00-17:00' &&
                        option.value !== '13:00-15:00'
                    ) {
                        return true;
                    }
                    return false;
                }
                else if (timeOfDay > 18 && isTomorrow) {
                    if (
                        option.value !== 'ASAP' &&
                        option.value !== '21:00-23:00' &&
                        option.value !== 'Før 09:00' &&
                        option.value !== '09:00-11:00' &&
                        option.value !== '11:00-13:00'
                    ) {
                        return true;
                    }
                    return false;
                } 
                else {
                    if (option.value !== 'ASAP') {
                        return true;
                    }
                    return false;
                }
            })
                const firstOption = filteredOptions.length > 0 ? filteredOptions[0].value : '';
                setFormValues(prevFormValues => ({
                ...prevFormValues,
                tid: firstOption
                }));
    }, [formValues.dato])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: value }));
    };

    const handleOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formValues);
        var uid = "";
        if (user){
            uid = user.uid
        }
        if (formValues.price === undefined) {
            priceReRun();
        }
        if (formValues.dato !== ''){
            var today = new Date();
            var year = today.getFullYear();
            var month = (today.getMonth() + 1).toString().padStart(2, '0');
            var day = today.getDate().toString().padStart(2, '0');
            var date = year + '/' + month + '/' + day;
            var dateTime =   date + '-' + today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0');
            const fullMessage = baseMessage + dateMessage + addressMessage + priceMessage + itemsMessage + misingItemsOrder + (additionalInfoMessage? additionalInfoMessage : '');
            addToFS({
                navn: formValues.name,
                tlf: formValues.phone,
                varer: formValues.varer,
                lokasjon: formValues.address,
                leveringspris: formValues.price,
                leveringstid: formValues.tid,
                mottatt: dateTime,
                ekstraInfo: formValues.additionalInfo,
                to: phoneNumbers,
                body: fullMessage,
                ownerId: uid,
                onskerOrdreMedMangler: formValues.extraChecked,
            }).then((newOrder: any) => {
                navigate('/OrderConfirmation', { state: {formValues, today} })
              }).catch((error: any) => {
                console.error(error);
                setAlertDescription('Det oppstod en feil innsending av bestillingen. Prøv gjerne å sende inn på nytt! Om problemet vedvarer kan du bestille ved å ringe eller sende melding til oss på tlf: 489 12 203');
                setIsAlertActive(true);
            })
        }
        else {
            setAlertDescription('Du må velge en dato. ');
            setIsAlertActive(true);
        }
    };
  
    function priceReRun() {
        const loader = new Loader({
            apiKey: "AIzaSyB6sUX3FkoYzCqh62Pmiuq0kTfFGHLZ9Pc",
            libraries: ["places", "geometry"],
        });
        loader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        const newPrice = geocoder.geocode({ address: formValues.address }, async (results, status) => {
        if (status === "OK") {
            if (results){
                const destinationLatLng = results[0].geometry.location;
                
                const polyCenter = {lat: 58.029106355706546, lng: 7.447113548546337};
                const service = new google.maps.DistanceMatrixService();
                const destinationA = destinationLatLng;
                
                const request = {
                    origins: [polyCenter],
                    destinations: [destinationA],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false,
                };
                const distKm = service.getDistanceMatrix(request).then((response: { rows: { elements: { distance: { value: any; }; }[]; }[]; }) => {
                    if (response){
                    const distanceInMeters = response.rows[0].elements[0].distance.value;
                    console.log('distanceInMeters', distanceInMeters);
                    const distanceInKilometers = distanceInMeters / 1000;
                    return distanceInKilometers;
                    }
                    else {
                    console.log("No response");
                    return 0;
                    }
                }).catch((e: any) => {
                    console.log('EEEEE',e);
                    return 0;
                });
                const newPrice = calculatePrice(await distKm);
                console.log('newPrice', newPrice);
                setFormValues((prevFormValues) => ({ ...prevFormValues, price: newPrice }));
            }
        }
    })
    })
    }

    function calculatePrice(km: number) {
        var pris = 0
        if (km == 0) return 0;
        else if (km <= 5) pris = 119;
        else {
        pris = 119 + (20 * (km - 5));
        }
        pris = Math.round(pris);
        return pris;
    }

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

    const handleRetrievedDate = (selectedDate: Date) => {
    const datestring = selectedDate?.getDate() + '/' + (selectedDate?.getMonth() + 1) + '/' + selectedDate?.getFullYear();
    setFormValues((prevFormValues) => ({ ...prevFormValues, dato: datestring }));
    const today = new Date();

    if (selectedDate?.getDate() === today.getDate() + 1) setIsTomorrow(true);
    else setIsTomorrow(false);

    if (selectedDate?.getDate() === today.getDate()){
        setIsToday(true);
    }
    else setIsToday(false);

    const isAfterApril10 = selectedDate >= new Date(selectedDate.getFullYear(), 3, 11);
    const isBeforeJune18 = selectedDate < new Date(selectedDate.getFullYear(), 5, 18);

    if (isAfterApril10 && isBeforeJune18) {
        setIsOffSeason(true);
    } else {
        setIsOffSeason(false);
    }
    if (formValues.price === undefined) {
        priceReRun();
    }
    };

  return (
    <div className="OrderDetails" style={{width: '80%', margin: '60px auto', maxWidth: '600px'}}>
        <ThreeStepProgressBar currentStep={2} />
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
        <div className='form-container' style={{marginTop: '30px'}}>
            <form onSubmit={handleOrder}>
            <h2 >Informasjon</h2>
            <div>
                <Calendar onRetrievedDate={handleRetrievedDate}/><br/>
                {formValues.dato &&
                    <div className="select">
                       <select
                            value={formValues.tid}
                            onChange={event => {
                                setFormValues((prevFormValues) => ({ ...prevFormValues, tid: event.target.value }));
                            }}
                        >
                        {options.filter(option => {
                            if (isToday) {
                                if (option.value === 'ASAP' && timeOfDay < 20 && timeOfDay > 12) {
                                    return true;
                                } else if (option.value.includes('-')) {
                                    const startTime = parseInt(option.value.split('-')[0].split(':')[0]);
                                    return startTime - 1 > timeOfDay;
                                }
                                return false;
                            } 
                            else if (isOffSeason) {
                                if (
                                    option.value !== 'ASAP' &&
                                    option.value !== '19:00-21:00' &&
                                    option.value !== '17:00-19:00' &&
                                    option.value !== '15:00-17:00' &&
                                    option.value !== '13:00-15:00'
                                ) {
                                    return true;
                                }
                                return false;
                            }
                            else if (timeOfDay > 18 && isTomorrow) {
                                if (
                                    option.value !== 'ASAP' &&
                                    option.value !== '21:00-23:00' &&
                                    option.value !== 'Før 09:00' &&
                                    option.value !== '09:00-11:00' &&
                                    option.value !== '11:00-13:00'
                                ) {
                                    return true;
                                }
                                return false;
                            } 
                            else {
                                if (option.value !== 'ASAP') {
                                    return true;
                                }
                                return false;
                            }
                        })
                        .map(option => (
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}

                        </select>
                        <div className="select__arrow"></div>
                        </div>
                }
            </div>
            <div>
                <label htmlFor="name">Navn:</label><br/><br/>
                <input 
                    type="text" 
                    name="name" 
                    value={formValues.name} 
                    onChange={handleInputChange} 
                    required 
                    onInvalid={(e) => ((e.target as HTMLInputElement).setCustomValidity('Vennligst skriv inn ditt navn.'))}
                    onInput={(e) => ((e.target as HTMLInputElement).setCustomValidity(''))}
                    // title="Vennligst skriv inn ditt navn."
                    />
            </div>
            <div>
                <label htmlFor="phone">Telefon:</label><br/><br/>
                <input 
                    type="text" 
                    name="phone" 
                    value={formValues.phone} 
                    onChange={handleInputChange} 
                    required 
                    onInvalid={(e) => ((e.target as HTMLInputElement).setCustomValidity('Vennligst skriv inn ditt telefonnummer.'))}
                    onInput={(e) => ((e.target as HTMLInputElement).setCustomValidity(''))}
                />
            </div>
            <div className='comments'>
                <label htmlFor="additionalInfo">Tilleggsinformasjon / kommentarer til Handlehjelpen: </label><br/>
                <textarea name="additionalInfo" value={formValues.additionalInfo} onChange={handleInputChange} />
            </div>
            <Button type="submit" variant='contained' color='success' style={{maxWidth: '150px'}}>Send inn</Button>
            </form>
        </div>
    </div>
  );
};

export default InformationForm;
