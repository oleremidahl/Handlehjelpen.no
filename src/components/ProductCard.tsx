import React from "react";
import "../css/product_card.css";
import { Link } from "react-router-dom";

const ProductCard = () => {

    return (
        <div className="product_card" >	
            <div className="product-details">
                <h1>Få ferske matvarer <br/> levert rett hjem <br/> til deg</h1>
                <br/>
                    <p className="information"> 
                    Vår leveringstjeneste tilbyr bekvemmeligheten ved å få dine favorittmatvarer fra 
                    lokale restauranter og den billigste matvarekjeden Rema 1000, levert rett hjem til deg! <br/>
                    Bestill nå og opplev den enkle og behagelige opplevelsen med å få måltidene dine levert til deg. </p>
                <div className="control">
                    <Link to="/OneOrder">
                        <button className="buy_btn">
                            <span className="shopping-cart"><i className="fa fa-shopping-cart" aria-hidden="true"></i></span>
                            <span className="buy">Bestill nå</span>
                        </button>
                    </Link>    
                </div>		
            </div>
        </div>
    );
};

export default ProductCard;
