import React, { useState } from "react";

const Groceries = () => {
    const [items, setItems] = useState<string[]>(JSON.parse(localStorage.getItem('items') || '[]'));
    const [inpGoods, setInpGoods] = useState("");

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
            handleAdd(inpGoods)
        }
    }
    return (
            <div>
                <h1>Ny bestilling</h1>
                <p>Gjerne vær så spesifikk som mulig for å sikre at du får det du vil ha!</p>
                <textarea 
                name="varer"
                placeholder="Her kan du legge inn det du vil ha fra Rema 1000."
                onChange={event => setInpGoods(event.target.value)} 
                value = {inpGoods}
                onKeyDown = {handleKeydown}
                >
                </textarea>
                <br/><br/>
                <button className="submitBtn" onClick={() => handleAdd(inpGoods)}>Legg til</button> <br/>
                <div>
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
                
            </div>
    )
}
export default Groceries;