import { useEffect, useRef, useState } from "react";
import { AddressSelectionProps, PlaceAddress } from "../types";
import { Loader } from '@googlemaps/js-api-loader';
import '../css/AddressSelection.css';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


function AddressSelection({ onAddressSelected, onValidAddress }: AddressSelectionProps) {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>('');
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB6sUX3FkoYzCqh62Pmiuq0kTfFGHLZ9Pc",
      libraries: ["places", "geometry"],
    });
  
    loader.load().then(() => {
      const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current as HTMLInputElement, {
        fields: ["address_components", "geometry", "name"],
        types: ["address"],
        componentRestrictions: { country: "no" },
      });
      autocomplete.addListener("place_changed", async () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          setAlertDescription(`Ingen adresser funnet for: '${place.name}'. Om adressen kom opp som et alternativ, vennligst klikk på alternativet.`);
          setIsAlertActive(true);
          return;
        }
        const placeAddress: PlaceAddress = {
          street: `${getAddressComp(place, "street_number")} ${getAddressComp(place, "route")}`,
          city: getAddressComp(place, "locality"),
          state: getAddressComp(place, "administrative_area_level_1"),
          postalCode: getAddressComp(place, "postal_code"),
        };

        const polyCenter = {lat: 58.029106355706546, lng: 7.447113548546337};
        const service = new google.maps.DistanceMatrixService();
        const destinationA = {lat: place.geometry.location?.lat() ?? 0, lng: place.geometry.location?.lng() ?? 0};
        
        if (isInRange(destinationA)){
          setWarning(null);
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
          onAddressSelected(placeAddress, calculatePrice(await distKm));
          onValidAddress(true);
        }
        else {
          setWarning('Denne adressen er dessverre utenfor leveringsområdet. \n\n Du kan forhøre deg med oss på telefon 489 12 203 eller kontakt@handlehjelpen.no om det skulle være mulig for oss å levere likevel.');
          onValidAddress(false);
        }
        });
      });
    }, [onAddressSelected]);
  

  function getAddressComp(place: google.maps.places.PlaceResult, type: string) {
    const component = place.address_components?.find((c) => c.types.includes(type));
    return component?.long_name || "";
  };

  function isInRange(latlng: google.maps.LatLng | google.maps.LatLngLiteral) {
    var polyCenter = {lat: 58.029106355706546, lng: 7.447113548546337};
    var radiusInMeters = 11000;
    
    // generate points for circle
    var points = [];
    for (var i = 0; i < 36; i++) {
      var angle = i * 10;
      var offsetX = radiusInMeters * Math.cos(angle * Math.PI / 180);
      var offsetY = radiusInMeters * Math.sin(angle * Math.PI / 180);
      var newLat = polyCenter.lat + (offsetY / 111111);
      var newLng = polyCenter.lng + (offsetX / (111111 * Math.cos(polyCenter.lat * Math.PI / 180)));
      points.push({lat: newLat, lng: newLng});
    }
    const bermudaTriangle = new google.maps.Polygon({
      paths: points,
    });
  
    if (google.maps.geometry.poly.containsLocation(latlng, bermudaTriangle)) {
      return true;
    } 
    return false;
  };

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
  

  return (
    <div className="card-container">
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
      <div className="panel">
        <div>
          <img className="sb-title-icon" src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg" alt="" />
          <span className="sb-title">Søk etter adresse</span>
        </div>
        <input type="text" placeholder="Skriv inn og klikk på addressen " ref={locationInputRef} />
        {/* {distance !== 0 && <div className="address-text">{distance}</div>} */}
        {warning && <div className="address-text">{warning}</div>}
      </div>
    </div>
  );
}

export default AddressSelection;

