import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF ,Polygon, useLoadScript } from '@react-google-maps/api';

declare const google: any;

function GoogleMapComponent() {
  
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

  const libraries = ['geometry']

const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBaJL0qOKJmBO_DJeYZWa-WrrDfaAqv6xo",
    // libraries
  });

  const findPos = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(latitude, longitude), bermudaTriangle)){
          setSelectedLocation({ lat: latitude, lng: longitude });
          geocodeLatLng(selectedLocation.lat, selectedLocation.lng);
        }
        // setLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
      }
      );
  };

  const onMapLoad = (map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(location);
    setMap(map);
    map.setZoom(13);
  };
  
  useEffect(() => {
    if(selectedLocation) {
        geocodeLatLng(selectedLocation.lat, selectedLocation.lng);
    }
    console.log(selectedLocation)
}, [selectedLocation])

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
    } 
});



  // if (loadError) return 'Error loading maps';
  // if (!isLoaded) return 'Loading Maps';
  // const MapWrapped = withScriptjs(withGoogleMap((props) =>{}
  return (
    <>
    {!isLoaded || loadError ? (
      <p>Laster kart...</p>
    ):
    
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || center}
        zoom={8}
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
      {selectedLocation ? (
        <>
        <p>
          Latitude: {selectedLocation.lat}, Longitude: {selectedLocation.lng}
        </p>
        <p>{formattedAdress}</p>
        </>
      ) : (
        <p>Click on the map to select a location</p>
      )}
    </div>
}</>
  );
}

export default GoogleMapComponent;
