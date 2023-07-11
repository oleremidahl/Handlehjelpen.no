import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ThreeStepProgressBar from "./ThreeStepProgressBar";
import { Loader } from '@googlemaps/js-api-loader';
import "../css/AI/AI_OrderField.css";



const TakeAway = () => {
    const loc = useLocation();
    const address = loc.state.address;
    const price = loc.state.price;
    const [takeawayItems, setTakeawayItems] = useState<string[]>(JSON.parse('[]')); //localStorage.getItem('takeawayItems') || 
    const [inpGoods, setInpGoods] = useState("");
    const navigate = useNavigate();
    const [isExtraChecked, setIsExtraChecked] = useState(true);
    const [restaurant, setRestaurant] = useState("");
    const [restaurants, setRestaurants] = useState<string[]>([]);
    const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
    const [alertDescription, setAlertDescription] = useState<string>('');


    // useEffect(() => {
    //     localStorage.setItem('takeawayItems', JSON.stringify(takeawayItems));
    // }, [takeawayItems]);

    const handleRemove = (index: number) => {
        const newItems = [...takeawayItems];
        newItems.splice(index, 1);
        setTakeawayItems(newItems);
    };
    
    const handleAdd = (good: string) => {
        if (good !== ""){
            const newItems = [...takeawayItems];
            newItems.push(good);
            setTakeawayItems(newItems);
            setInpGoods("");
        }
    };

    const removeAll = () => {
        setTakeawayItems([]);
    }

    const handleKeydown = (event:  {key: string;} ) =>  {
        if (event.key === 'Enter'){
            handleAdd(inpGoods);
        }
    };

    const handleExtraCheckboxChange = (event: any) => {
        setIsExtraChecked(event.target.checked);
    }

    const handleOrder = () => {
        if (restaurant !== ""){
            navigate("/ContactInfo", {state: {
                varer: takeawayItems,
                type: restaurant,
                address: address,
                price: price,
                extraChecked: isExtraChecked
            }});
        }
        else {
            setAlertDescription('Du må velge en restaurant. ');
            setIsAlertActive(true);
        }
    }
    const txtAreaPlaceholder = `Her kan du legge inn det du vil ha fra ${restaurant ? restaurant : 'din valgte restaurant'} `;

    useEffect(() => {
        const loader = new Loader({
          apiKey: "AIzaSyB6sUX3FkoYzCqh62Pmiuq0kTfFGHLZ9Pc",
          libraries: ["places", "geometry"],
        });
      
        loader.load().then(() => {
          const service = new window.google.maps.places.PlacesService(
            document.createElement("div")
          );
      
          const restaurantRequest: google.maps.places.PlaceSearchRequest = {
            location: new window.google.maps.LatLng(58.0274, 7.4606),
            radius: 5000,
            type: "restaurant",
          };
      
          const takeawayRequest: google.maps.places.PlaceSearchRequest = {
            location: new window.google.maps.LatLng(58.0274, 7.4606),
            radius: 5000,
            type: "meal_takeaway",
          };
      
          const fetchPlaces = async (request: google.maps.places.PlaceSearchRequest) => {
            return new Promise<string[]>((resolve, reject) => {
              service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                  const restaurantNames = results.map((result) => result.name);
                  if (restaurantNames) {
                      const filteredRestaurantNames = restaurantNames.filter(name => name !== undefined) as string[];
                      resolve(filteredRestaurantNames);
                 } 
                 else {
                  reject(new Error(status));
                }
              }});
            });
          };
      
          Promise.all([fetchPlaces(restaurantRequest), fetchPlaces(takeawayRequest)])
            .then(([restaurants, takeaways]) => {
                const uniquePlaces = [...new Set([...restaurants, ...takeaways])];
                const sortedPlaceNames = uniquePlaces.sort((a, b) => a.localeCompare(b));
                setRestaurants(sortedPlaceNames);
            })
            .catch((error) => console.error(error));
        });
      }, []);

    return (
            <div className="OrderDetails" style={{width: '80%', margin: '60px auto', maxWidth: '600px'}}>
                <ThreeStepProgressBar currentStep={1} />
                <Dialog open={isAlertActive} 
                    onClose={() => setIsAlertActive(false)} 
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
                <h1>Ny bestilling</h1>
                <h2>Velg restaurant</h2>
                <div className="select">
                <select value={restaurant} onChange={(event) => setRestaurant(event.target.value)}>
                    <option value="">Velg en restaurant</option>
                    {restaurants.map((restaurantName) => (
                        <option key={restaurantName} value={restaurantName}>
                        {restaurantName}
                        </option>
                    ))}
                    <option value="Andre">Annen restaurant</option>
                    </select> 
                <div className="select__arrow" style={{marginTop: '-6px'}}></div>
                </div>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <textarea 
                name="varer"
                placeholder={txtAreaPlaceholder}
                onChange={event => setInpGoods(event.target.value)} 
                value = {inpGoods}
                onKeyDown = {handleKeydown}
                style={{height: '100px'}}
                >
                </textarea>
                <br/><br/>
                <button className="submitBtn" onClick={() => handleAdd(inpGoods)}>Legg til</button> <br/>
                <div className="OrderView">
                    <h3>Din ordre:</h3>
                    {takeawayItems.length !== 0 &&
                    <>
                        <button className="submitBtn" style={{float: 'right'}} onClick={removeAll}>Fjern alle</button>
                        <br/><br/>
                        <ul>
                            {takeawayItems.map((item, index) => (
                                <li key={index} style={{marginTop: '15px'}}>
                                {item}
                                <button className="listBtn" onClick={() => handleRemove(index)}>X</button>
                            </li>
                            ))}
                        </ul>
                    </>
                    }
                </div>
                {takeawayItems.length !== 0 &&
                    <>
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
                        <Button variant="contained" color="success" onClick={handleOrder} style={{marginTop: '20px'}}>Gå videre</Button>
                    </>
                }
            </div>
    )
}
export default TakeAway;