import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//'userId' is a prop
const InventoryManager = ({ userId }) => {
    const [resData, setResData] = useState([]); //store fetched inventory data
    const [usersData, setUsersData] = useState({}); //store fetched users' data
    const [editMode, setEditMode] = useState(null); //track if an item is being edited
    const [newItem, setNewItem] = useState({ item_name: '', description: '', quantity: 0 }); //store data for adding new item
    const [currentItem, setCurrentItem] = useState({ item_name: '', description: '', quantity: 0 }) //store data for 'current' selected item
    const navigate = useNavigate();

    useEffect(() => {
        console.log('UserId:', userId);

        //fetch user data; need this to display firstname instead of user_id
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/Users');
                if (!response.ok) {
                    throw new Error('Network response failed');
                }
                const users = await response.json();
                const usersMap = users.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setUsersData(usersMap);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        //fetches inventory prior to modifications
        const fetchInventory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/Users/${userId}/InvManager`);
                if (!response.ok) {
                    throw new Error('Network response failed');
                }
                const data = await response.json();
                setResData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchUsers();
        fetchInventory();
    }, [userId]);

    //handles POST request
    const handleAddItem = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/Users/${userId}/InvManager`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (response.ok) {
                setNewItem({ item_name: '', description: '', quantity: 0 });
                fetchModInventory(); // Fetches 'modified' inventory after adding new item
            } else {
                console.error('Failed to add item');
            }
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    //PATCH requests
    const handleEditItem = async () => {
        try {
            // console.log('User ID:', userId);

            const response = await fetch(`http://localhost:8080/Users/${userId}/InvManager/${currentItem.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentItem),
            });
            if (response.ok) {
                setEditMode(null);
                fetchModInventory(); // Fetches 'modified' inventory after editing item
            } else {
                console.error('Failed to edit item');
            }
        } catch (error) {
            console.error('Failed to edit item:', error);
        }
    };

    //DELETE requests
    const handleDeleteItem = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:8080/Users/${userId}/InvManager/${itemId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchModInventory(); // Fetches 'modified' inventory after deleting item
            } else {
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };
    //funcition to fetch 'modified' inventory after adding, editing, or deleting
    const fetchModInventory = async () => {
        try {
            const response = await fetch(`http://localhost:8080/Users/${userId}/InvManager`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResData(data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return (
        <div className="inventory">
            <h1>Inventory</h1>
            <p>You may add items to this inventory list</p>
            <form onSubmit={handleAddItem}>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.item_name}
                    onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })}
                    required
                />
                <button type="submit">Add Item</button>
            </form>
            <p>you may also edit, and delete these items.</p>
            {/* iterates over the 'resData' array of inventory to display each item */}
            {resData.length > 0 ? (
                resData.map((item) => (
                    <div key={item.id}>
                        {editMode === item.id ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleEditItem(); }}>
                                <input
                                    type="text"
                                    value={currentItem.item_name}
                                    onChange={(e) => setCurrentItem({ ...currentItem, item_name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={currentItem.description}
                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={currentItem.quantity}
                                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value, 10) })}
                                />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditMode(null)}>Cancel</button>
                            </form>
                        ) : (
                            <div>
                                <h2>Item: {item.item_name}</h2>
                                <p>Description: {item.description}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Last modified by: {usersData[item.users_id] ? usersData[item.users_id].firstname : 'Loading...'}</p>
                                <button type="button" onClick={() => { setEditMode(item.id); setCurrentItem(item); }}>Edit</button>
                                <button type="button" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No items in inventory.</p>
            )}
        </div>
    );
};

export default InventoryManager;
