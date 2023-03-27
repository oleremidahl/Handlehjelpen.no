import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import PlacesAutocomplete from 'react-places-autocomplete';
import '../css/GMapStyles.css';

declare const google: any;

interface relInf {
  selectedLocation: any | null;
  formattedAdress: string;
  distancePrice: number | undefined;
}

function GoogleMapComponent(props: any) {
  
  const containerStyle = {
    maxWidth: '400px',
    height: '400px',
    border: 'thin solid black'
  };
  
  const center = {
    lat: 58.029106355706546, 
    lng: 7.447113548546337
  };
  const [location, setLocation] = useState(center);
  const [map, setMap] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [relevantInfo, setRelevantInfo] = useState<relInf>({
    selectedLocation: null,
    formattedAdress: '',
    distancePrice: undefined
  })

  useEffect(() => {
    console.log('Pris ', relevantInfo.distancePrice);
    props.onRetrievedVariables(relevantInfo.selectedLocation, relevantInfo.formattedAdress, relevantInfo.distancePrice);
  }, [relevantInfo.distancePrice]);

  
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
    if(relevantInfo.selectedLocation) {
      geocodeLatLng(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng)
        .then(() => {
          calculateDistanceAndPrice(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng);
        })
        .catch((e: string) => console.log("Error: " + e));
    }
  }, [relevantInfo.selectedLocation]);
  
  
  

  // useEffect(() => {
  //   if(selectedOption && selectedLocation) {
  //     calculateDistanceAndPrice(selectedLocation.lat, selectedLocation.lng, selectedOption);
  //   }
  // })

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
          const newRelInf = {...relevantInfo, selectedLocation: { lat: latitude, lng: longitude }}
          // setSelectedLocation();
          setRelevantInfo(newRelInf);
          // geocodeLatLng(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng);
        }
        else {
          alert("Du befinner deg utenfor vårt leveringsområde.")
        }
      },
      (error) => {
        alert("Det ser ut til at du har deaktivert stedstjenester. Du kan enten aktivere dette eller finne din lokasjon manuelt.")
        console.error(error);
      }
      );
  };
      
  const geocoder = new google.maps.Geocoder();
  function geocodeLatLng(lat: number, lng: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(lat, lng), bermudaTriangle)){
        geocoder
          .geocode({ location: {lat: lat, lng: lng } })
          .then((response: { results: any[]; }) => {
            if (response.results[0]) {
              const newRelInf = {...relevantInfo, formattedAdress: response.results[0].formatted_address }
              setRelevantInfo(newRelInf);
              resolve(); // Resolve the promise
            } else {
              reject("No results found"); // Reject the promise with an error message
            }
          })
          .catch((e: string) => reject("Geocoder failed due to: " + e)); // Reject the promise with an error message
      } else {
        reject(""); // Reject the promise with an error message
      }
    });
  }
  

  function calculateDistanceAndPrice(lat: number, lng: number) {
    const referencePoint = { lat: 58.021697654760224 * (Math.PI/180), lng: 7.455554489881608 * (Math.PI/180)};
    
    const distanceInRadians = (
      Math.acos(
        Math.sin(referencePoint.lat) * Math.sin(lat * (Math.PI/180)) +
        Math.cos(referencePoint.lat) * Math.cos(lat * (Math.PI/180)) *
        Math.cos((lng * (Math.PI/180)) - referencePoint.lng)
      )
    );
  
    var km = (distanceInRadians * 6371);

    if (km){
      var pris = 0
      if (km <= 4) pris = 119;
      else {
        pris = 119 + (20 * (km - 4));
      }
      console.log('Pris i kalkulasjon: ',pris);
      const newRelInf = {...relevantInfo, distancePrice: Math.round(pris) }
      setRelevantInfo(newRelInf);
    }
  }

  const handleSelectChange = (event: any) => {
    const newRelInf = {...relevantInfo, selectedOption: event.target.value }
    setRelevantInfo(newRelInf);
    // setSelectedOption(event.target.value);
    if(relevantInfo.selectedLocation){
      calculateDistanceAndPrice(relevantInfo.selectedLocation.lat, relevantInfo.selectedLocation.lng);
    }
  }

// PERIMETER ---------------------------
var polyCenter = {lat: 58.029106355706546, lng: 7.447113548546337};
var radiusInMeters = 10000;

// generate points for circle
var points = [];
for (var i = 0; i < 36; i++) {
  var angle = i * 10;
  var offsetX = radiusInMeters * Math.cos(angle * Math.PI / 180);
  var offsetY = radiusInMeters * Math.sin(angle * Math.PI / 180);
  var newLat = polyCenter.lat + (offsetY / 111111);
  var newLng = polyCenter.lng + (offsetX / (111111 * Math.cos(center.lat * Math.PI / 180)));
  points.push({lat: newLat, lng: newLng});
}

  const bermudaTriangle = new google.maps.Polygon({
    paths: points,
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0,
  });

  bermudaTriangle.setMap(map);
  bermudaTriangle.addListener('click', (event: google.maps.MapMouseEvent) => {
    if (event.latLng && event.latLng && google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle)) {
      const newRelInf = {...relevantInfo, selectedLocation: { lat: event.latLng.lat(), lng: event.latLng.lng() }}
      // setSelectedLocation();
      setRelevantInfo(newRelInf);
      // calculateDistanceAndPrice( event.latLng.lat(), event.latLng.lng());
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
          {relevantInfo.selectedLocation && (
            <MarkerF
              position={relevantInfo.selectedLocation}
            />
          )}
        </GoogleMap><br/>
        <button className="submitBtn" onClick={() => findPos()}>Klikk for å finne min posisjon</button>
        {relevantInfo.selectedLocation && <p>{relevantInfo.formattedAdress}</p>}
        {/* <p style={{marginBottom: '10px'}}>Destinasjonen kan nås med: </p> */}
        {/* <div className='select'>
          <select onChange={handleSelectChange}>
            <option value="Bil">Bil</option>
            <option value="Båt">Båt</option>
          </select>
          <div className="select__arrow"></div>
        </div> */}
        
        {/* {relevantInfo.distancePrice && <p>Pris for levering: {relevantInfo.distancePrice} kr</p>} */}
      </div>
    }</>
  );
}

export default GoogleMapComponent;
