import React from "react";
import "../css/product_card.css";
import { Link } from "react-router-dom";

const ProductCard = ({title, info, price, image, link, isLoggedIn}: {title: string, info: string, price: string, image: string, link: string, isLoggedIn: boolean | null}) => {
    if (isLoggedIn == null) {}
    else if(!isLoggedIn) link = "/login";
    return (
        <div className="product_card" >	
            <div className="product-details">
                <h1>{title}</h1>
                {/* <span className="hint-star star">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                </span> */}
                    <p className="information"> {info} </p>
                <div className="control">
                    <Link to={link}>
                        <button className="buy_btn">
                            <span className="price">{price}</span>
                            <span className="shopping-cart"><i className="fa fa-shopping-cart" aria-hidden="true"></i></span>
                            <span className="buy">Bestill nå</span>
                        </button>
                    </Link>    
                </div>		
            </div>
            {/* <div className="product-image">
                <img src={image} alt="Bilde av Matvarer"></img>
            </div> */}
        </div>
    );
};

export default ProductCard;
