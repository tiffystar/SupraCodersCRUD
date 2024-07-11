import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryManager = ({ userId }) => {
    const [resData, setResData] = useState([]);
    const [usersData, setUsersData] = useState({});
    const [editMode, setEditMode] = useState(null);
    const [newItem, setNewItem] = useState({ item_name: '', description: '', quantity: 0 });
    const [currentItem, setCurrentItem] = useState({ item_name: '', description: '', quantity: 0 })
    const navigate = useNavigate();

    useEffect(() => {
        // console.log('UserId:', userId);
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
                fetchModInventory(); // Fetch updated inventory after adding the new item
            } else {
                console.error('Failed to add item');
            }
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    const handleEditItem = async (item) => {
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
                fetchModInventory(); // Fetch updated inventory after editing the item
            } else {
                console.error('Failed to edit item');
            }
        } catch (error) {
            console.error('Failed to edit item:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:8080/Users/${userId}/InvManager/${itemId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchModInventory(); // Fetch updated inventory after deleting the item
            } else {
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };
    // fetch 'modified' inventory after adding, editing, or deleting
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
