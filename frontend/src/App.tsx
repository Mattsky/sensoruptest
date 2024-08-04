import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import './App.css';

interface Item {
    id: number;
    name: string;
    description: string;
}

function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState({ name: '', description: '' });
    const [editItem, setEditItem] = useState<Item | null>(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const response = await fetch(backendUrl || '');
        const data = await response.json();
        setItems(data);
    };

    const createItem = async () => {
        const response = await fetch(backendUrl || '', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });
        const data = await response.json();
        setItems([...items, data]);
    };

    const updateItem = async (id: number) => {
        if (!editItem) return;
        const response = await fetch(`${backendUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editItem),
        });
        const data = await response.json();
        setItems(items.map(item => (item.id === id ? data : item)));
        setEditItem(null);
    };

    const deleteItem = async (id: number) => {
        await fetch(`${backendUrl}/${id}`, {
            method: 'DELETE',
        });
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Platform Engineer Interview</p>
            </header>
            <div className="App-body">
                <h1>CRUD Operations</h1>
                <div>
                    <h2>Create Item</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newItem.name}
                        onChange={e => setNewItem({...newItem, name: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                    />
                    <button onClick={createItem}>Create</button>
                </div>
                <div>
                    <h2>Items</h2>
                    <ul>
                        {items.map(item => (
                            <li key={item.id}>
                                {editItem && editItem.id === item.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editItem.name}
                                            onChange={e => setEditItem({...editItem, name: e.target.value})}
                                        />
                                        <input
                                            type="text"
                                            value={editItem.description}
                                            onChange={e => setEditItem({...editItem, description: e.target.value})}
                                        />
                                        <button onClick={() => updateItem(item.id)}>Update</button>
                                    </>
                                ) : (
                                    <>
                                        <strong>{item.name}</strong>: {item.description}
                                        <button onClick={() => setEditItem(item)}>Edit</button>
                                        <button onClick={() => deleteItem(item.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
