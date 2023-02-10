import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import PlacesAutocomplete from 'react-places-autocomplete';
import '../css/GMapStyles.css';

declare const google: any;

function GoogleMapComponent(props: any) {
  
  const containerStyle = {
    width: '400px',
    height: '400px',
    border: 'thin solid black'
  };
  
  const center = {
    lat: 58.0243,
    lng: 7.44919
  };
  const [location, setLocation] = useState(center);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  const [formattedAdress, setFormattedAdress] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [distanceInKilometers, setDistanceInKilometres] = useState<number>();
  const [distancePrice, setDistancePrice] = useState<number>();
  const [selectedOption, setSelectedOption] = useState('Bil');
  const { onRetrievedVariables } = props;

  onRetrievedVariables(selectedLocation, selectedOption, formattedAdress);

const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBaJL0qOKJmBO_DJeYZWa-WrrDfaAqv6xo",
  });

//MAP -----------------------
  const onMapLoad = (map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(location);
    setMap(map);
    map.setZoom(13);
  };
  
  useEffect(() => {
    if(selectedLocation) {
      geocodeLatLng(selectedLocation.lat, selectedLocation.lng);
      if(selectedOption) calculateDistanceAndPrice(selectedLocation.lat, selectedLocation.lng, selectedOption);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if(selectedOption && selectedLocation) {
      calculateDistanceAndPrice(selectedLocation.lat, selectedLocation.lng, selectedOption);
    }
  })

  // let autocomplete: google.maps.places.Autocomplete;
  // useEffect(() => {
  //   if (isLoaded) {
  //     // const input = document.getElementById('search-input');
  //     // if (input) {
  //   autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-input') as HTMLInputElement, {
  //       componentRestrictions: { administrativeArea: 'NO-42'}, 
  //       fields: ['name']
  //     });
    
  //   autocomplete.addListener('place_changed', onPlaceChanged);
  //   }
  // }, []);
  
  
  
  const onMapClick = (event: google.maps.MapMouseEvent) => {
    // if (event.latLng && event.latLng && google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle)){
      //       setSelectedLocation({
        //         lat: event.latLng.lat(),
        //         lng: event.latLng.lng()
        //       });
        //       console.log('Eveeeeent',event.latLng.lat())
        //     } 
        // else(console.log("Falseeeee"))
      };

//GEOCODING -----------------------
  const findPos = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(latitude, longitude), bermudaTriangle)){
          setSelectedLocation({ lat: latitude, lng: longitude });
          geocodeLatLng(selectedLocation.lat, selectedLocation.lng);
        }
      },
      (error) => {
        console.error(error);
      }
      );
  };
      
  const geocoder = new google.maps.Geocoder();
  function geocodeLatLng(lat: number, lng: number) {
    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(lat, lng), bermudaTriangle)){
      geocoder
        .geocode({ location: {lat: lat, lng: lng } })
        .then((response: { results: any[]; }) => {
          if (response.results[0]) {
            // map.setZoom(13);
            setFormattedAdress(response.results[0].formatted_address);
          } else {
            window.alert("No results found");
          }
        })
        .catch((e: string) => window.alert("Geocoder failed due to: " + e));
    }
  }

  function calculateDistanceAndPrice(lat: number, lng: number, car: string) {
    const referencePoint = { lat: 58.021697654760224 * (Math.PI/180), lng: 7.455554489881608 * (Math.PI/180)};
    
    const distanceInRadians = (
      Math.acos(
        Math.sin(referencePoint.lat) * Math.sin(lat * (Math.PI/180)) +
        Math.cos(referencePoint.lat) * Math.cos(lat * (Math.PI/180)) *
        Math.cos((lng * (Math.PI/180)) - referencePoint.lng)
      )
    );
  
    setDistanceInKilometres(distanceInRadians * 6371);
    console.log('Avstaaaaand',distanceInKilometers);
    var mult = 3;
    if (car === 'Bil') mult = 2;

    if (distanceInKilometers){
      var drivingTime = mult * distanceInKilometers;
      if (drivingTime > 25) drivingTime = drivingTime * 2;
      else if (drivingTime > 20) drivingTime = drivingTime * 1.75;
      else if (drivingTime > 15) drivingTime = drivingTime * 1.5;
      
      setDistancePrice(Math.round(250 + (((drivingTime * 2)/60)*500)))
    }
  }

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
    if(selectedLocation){
      calculateDistanceAndPrice(selectedLocation.lat, selectedLocation.lng, selectedOption)
    }
  }

// PERIMETER ---------------------------
  const latLngPaths = [
    { lat: 58.013895, lng: 7.668140 },
    { lat: 58.051737, lng: 7.706315 },
    { lat: 58.127733, lng: 7.536405 },
    { lat: 58.048022, lng: 7.196158},
    { lat: 57.988490, lng: 7.341362},
    { lat: 57.965142, lng: 7.493917}
  ]

  const bermudaTriangle = new google.maps.Polygon({
    paths: latLngPaths,
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0,
  });

  bermudaTriangle.setMap(map);
  bermudaTriangle.addListener('click', (event: google.maps.MapMouseEvent) => {
    if (event.latLng && event.latLng && google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle)) {
        setSelectedLocation({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          });
        // if(selectedOption) calculateDistanceAndPrice(selectedLocation.lat, selectedLocation.lng, selectedOption);
    } 
});

//SEARCHBAR -------------------

//   const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchInput(event.target.value);
//   };

//  function onPlaceChanged(){
//     const place = autocomplete.getPlace();
//     if (!place.geometry) {
//      const searchBar = document.getElementById('search-bar') as HTMLInputElement;
//      if (searchBar) searchBar.placeholder = "Søk etter din adresse";
//     }
//     else {
//       if(place.formatted_address){
//         setSearchInput(place.formatted_address)
//       }
//     }
//   }
    // const { lat, lng } = place.geometry.location;
    // setSelectedLocation({ lat, lng });

  // if (loadError) return 'Error loading maps';
  // if (!isLoaded) return 'Loading Maps';
  // const MapWrapped = withScriptjs(withGoogleMap((props) =>{}
  // onChange={handleSearchInputChange} value={searchInput}
  // const handleChange = (value: any) => {
  //   setSearchInput(value)
  // }

  // const handleSelect = (value: any) => {
  //   setSearchInput(value)
  // }

  return (
    <>
    {!isLoaded || loadError ? (
      <p>Laster kart...</p>
    ):
    
      <div>
        {/* <input id="search-bar" type="text" placeholder="Søk etter din adresse" /> */}
        {/* <PlacesAutocomplete
          value={searchInput}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "Søk etter din adresse...",
                })}
              />
              <div>
                {loading && <div>Laster...</div>}
                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? { backgroundColor: "#a83232", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };

                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete> */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location || center}
          zoom={8}
          options={{ streetViewControl: false }}
          onLoad={onMapLoad}
          onClick={onMapClick}
        >
          {selectedLocation && (
            <MarkerF
              position={selectedLocation}
            />
          )}
        </GoogleMap><br/>
        <button className="submitBtn" onClick={() => findPos()}>Klikk for å finne min posisjon</button>
        {selectedLocation && <p>{formattedAdress}</p>}
        <p>Destinasjonen kan nås med: <br/>
        <div className='select'>
          <select onChange={handleSelectChange}>
            <option value="Bil">Bil</option>
            <option value="Båt">Båt</option>
          </select>
          <div className="select__arrow"></div>
        </div>
        </p>
        {distancePrice && <p>Pris for levering: {distancePrice} kr</p>}
      </div>
    }</>
  );
}

export default GoogleMapComponent;
