import { Button, Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ThreeStepProgressBar from "./ThreeStepProgressBar";
import "../css/AI/AI_OrderField.css";

const Groceries = () => {
    const loc = useLocation();
    const address = loc.state.address;
    const price = loc.state.price;
    const [items, setItems] = useState<string[]>(JSON.parse(localStorage.getItem('items') || '[]'));
    const [inpGoods, setInpGoods] = useState("");
    const navigate = useNavigate();
    const [isExtraChecked, setIsExtraChecked] = useState(true);


    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items]);

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };
    
    const handleAdd = (good: string) => {
        if (good !== ""){
            const newItems = [...items];
            newItems.push(good);
            setItems(newItems);
            setInpGoods("");
        }
    };

    const removeAll = () => {
        setItems([]);
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
        navigate("/ContactInfo", {state: {
            varer: items,
            type: "Rema 1000",
            address: address,
            price: price,
            extraChecked: isExtraChecked
        }});
    }

    return (
            <div className="OrderDetails" style={{width: '80%', margin: '60px auto', maxWidth: '600px'}}>
                <ThreeStepProgressBar currentStep={1} />
                <h1>Ny bestilling</h1>
                <p><strong>Levering av take-away kommer tilbake til sommeren!</strong></p>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <textarea 
                name="varer"
                placeholder="Her kan du legge inn det du vil ha fra Rema 1000."
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
                    {items.length !== 0 &&
                    <>
                        <button className="submitBtn" style={{float: 'right'}} onClick={removeAll}>Fjern alle</button>
                        <br/><br/>
                        <ul>
                            {items.map((item, index) => (
                                <li key={index} style={{marginTop: '15px'}}>
                                {item}
                                <button className="listBtn" onClick={() => handleRemove(index)}>X</button>
                            </li>
                            ))}
                        </ul>
                    </>
                    }
                </div>
                {items.length !== 0 &&
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
export default Groceries;