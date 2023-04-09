import React, { useContext, useState } from "react";
import "../css/product_card.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { AuthContext } from '../context/AuthContext';
import { Button } from "@mui/material";
import { PlaceAddress } from "../types";
import AddressSelection from "./Searchbar";


const ProductCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const user = useContext(AuthContext);

    // const handleModalOpen = () => {
    //     if(!user){
    //         setIsModalOpen(true);
    //     }
    //     else {
    //         navigate("/Order");
    //         // TODO: Pass address to Order page
    //     }
    //   };
      
    // const handleModalClose = () => {
    //     setIsModalOpen(false);
    // };

    // const handleLoginClick = () => {
    //     navigate('/login');
    // };

    // const handleRegisterClick = () => {
    //     navigate('/register');
    // };

    // const handleContinueClick = () => {
    //     navigate('/Order');
    // };

    // Modal.setAppElement('#root');

    const [address, setAddress] = useState("");
    const [distance, setDistance] = useState(0);
    const [validAddress, setValidAddress] = useState(false);
    const [price, setPrice] = useState(0);

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
        navigate('/offers', {state: {address: address, price: price}});
    };
     
    return (
        <div className="product_card" >	
            <div className="product-details">
                <h1>Få ferske matvarer <br/> levert rett hjem <br/> til deg - Mandal</h1>
                <br/>
                    <p className="information"> 
                        Levering fra alle byens restauranter <br/>og dagligvarer fra Rema 1000!
                        <br/>
                        <strong>Kun kr 119 innen 4km!</strong>
                        <p>Finner du ikke addressen eller ønsker levering til offentlig plass?<br/> Ring oss på 489 12 203!</p>
                    </p>
                    {/* <p className="information"> 
                    Vår leveringstjeneste tilbyr bekvemmeligheten ved å få dine favorittmatvarer fra 
                    lokale restauranter og den billigste matvarekjeden Rema 1000, levert rett hjem til deg! <br/>
                    Bestill nå og opplev den enkle og behagelige opplevelsen med å få måltidene dine levert til deg. </p> */}
                <div >
                    <AddressSelection onAddressSelected={handleAddressSelected} onValidAddress={handleValidAddress}></AddressSelection><br/>
                    {validAddress && <Button onClick={handleContinue} className="buy_btn" variant="contained" color="success">
                        {/* <span className="shopping-cart"><i className="fa fa-shopping-cart" aria-hidden="true"></i></span> */}
                        <span className="buy">Gå videre</span>
                    </Button>
                    }
                </div>		
                {/* <Modal className="modal" isOpen={isModalOpen} onRequestClose={handleModalClose}>
                    <button className="close-button" onClick={handleModalClose}>X</button>
                    <h2>Logg Inn / Registrer deg eller Fortsett som Gjest</h2>
                    <button onClick={handleLoginClick}>Logg Inn</button><br/>
                    <button onClick={handleRegisterClick}>Registrer bruker</button><br/>
                    <button onClick={handleContinueClick}>Fortsett som Gjest</button>
                </Modal> */}
            </div>
        </div>
    );
};

export default ProductCard;
