import React, { useEffect, useState } from 'react';


const Inventory = () => {
    const [resData, setResData] = useState([]);

    useEffect(() => {

        const fetchInventory = async () => {
            try {
                const response = await fetch('http://localhost:8080/Inventory');
                if (!response.ok) {
                    throw new Error('Network response failed');
                }
                const data = await response.json();
                setResData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchInventory();
    }, []);

    return (
        <div className="item-list">
            <h1>Inventory</h1>
            {/* iterates over the 'resData' array of inventory to display each item */}
            {resData.length > 0 ? (
                <ul>
                    {resData.map((item) => (
                        <li key={item.id}>
                            <h2>{item.item_name}</h2>
                            <p>Description: {item.description}</p>
                            <p>Quantity: {item.quantity}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items in inventory.</p>
            )}
        </div>
    );
};

export default Inventory;