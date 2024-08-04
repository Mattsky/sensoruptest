const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = PORT;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Work around CORS for testing. Not a great idea in production.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "DELETE,POST,GET,PUT,OPTIONS,PATCH");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    }
    next();
});

// In-memory array to store items
let items = [];

// Create (POST) - Add a new item
app.post('/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        name: req.body.name,
        description: req.body.description
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Read (GET) - Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// Read (GET) - Get a single item by ID
app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
});

// Update (PUT) - Update an item by ID
app.put('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    res.json(item);
});

// Delete (DELETE) - Delete an item by ID
app.delete('/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
