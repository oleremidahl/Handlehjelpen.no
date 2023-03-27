import React, { useContext, useState } from "react";
import "../css/product_card.css";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { AuthContext } from '../context/AuthContext';


const ProductCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const user = useContext(AuthContext);

    const handleModalOpen = () => {
        if(!user){
            setIsModalOpen(true);
        }
        else {
            navigate("/OneOrder");
        }
      };
      
    const handleModalClose = () => {
    setIsModalOpen(false);
    };


    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleContinueClick = () => {
        navigate('/OneOrder');
    };

    Modal.setAppElement('#root');
     
    return (
        <div className="product_card" >	
            <div className="product-details">
                <h1>Få ferske matvarer <br/> levert rett hjem <br/> til deg - Mandal</h1>
                <br/>
                    <p className="information"> 
                    Vår leveringstjeneste tilbyr bekvemmeligheten ved å få dine favorittmatvarer fra 
                    lokale restauranter og den billigste matvarekjeden Rema 1000, levert rett hjem til deg! <br/>
                    Bestill nå og opplev den enkle og behagelige opplevelsen med å få måltidene dine levert til deg. </p>
                <div className="control">
                    {/* <Link to="/OneOrder"> */}
                        <button onClick={handleModalOpen} className="buy_btn">
                            <span className="shopping-cart"><i className="fa fa-shopping-cart" aria-hidden="true"></i></span>
                            <span className="buy">Bestill nå</span>
                        </button>
                    {/* </Link> */}
                </div>		
                <Modal className="modal" isOpen={isModalOpen} onRequestClose={handleModalClose}>
                    <button className="close-button" onClick={handleModalClose}>X</button>
                    <h2>Logg Inn / Registrer deg eller Fortsett som Gjest</h2>
                    <button onClick={handleLoginClick}>Logg Inn</button><br/>
                    <button onClick={handleRegisterClick}>Registrer bruker</button><br/>
                    <button onClick={handleContinueClick}>Fortsett som Gjest</button>
                </Modal>
            </div>
        </div>
    );
};

export default ProductCard;