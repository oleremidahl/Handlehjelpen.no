import React, { useState } from "react";
import "../css/product_card.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { PlaceAddress } from "../types";
import AddressSelection from "./Searchbar";


const ProductCard = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [validAddress, setValidAddress] = useState(false);
    const [price, setPrice] = useState<number | null>(null);

    function handleAddressSelected(placeAddress: PlaceAddress, price: number) {
      
      setAddress(placeAddress.street + ", " + placeAddress.postalCode + " " + placeAddress.city);
      setPrice(price);
    }

    function handleValidAddress(validAddress: boolean) {
      if (!validAddress) {
        setValidAddress(false);
      }
      else {
        setValidAddress(true);
      }
    }

    const handleContinue = () => { 
        navigate('/dagligvarer', {state: {address: address, price: price}});
    };
     
    return (
        <div className="product_card" >	
            <div className="product-details">
                <h1>Få ferske matvarer <br/> levert rett hjem <br/> til deg - Mandal</h1>
                <br/>
                    <div className="information"> 
                       <p> Morgenlevering hver tirsdag fra Rema 1000 <br/>frem til sommeren!
                        <br/>
                        <strong>Kun kr 119 innen 4km!</strong></p>
                        <p>Finner du ikke addressen eller ønsker levering til offentlig plass?<br/> Ring oss på 489 12 203!</p>
                    </div>
                <div>
                    <AddressSelection onAddressSelected={handleAddressSelected} onValidAddress={handleValidAddress}></AddressSelection><br/>
                        {price && <p>Levering til {address}: {price} kr</p>}
                    {validAddress && <Button onClick={handleContinue} className="buy_btn" variant="contained" color="success">
                        {/* <span className="shopping-cart"><i className="fa fa-shopping-cart" aria-hidden="true"></i></span> */}
                        <span className="buy">Gå videre</span>
                    </Button>
                    }
                </div>		
            </div>
        </div>
    );
};

export default ProductCard;
