const express = require('express');
const app = express();

// Middleware to parse JSON in request body
app.use(express.json());

// Sample inventory data
let inventory = [];

// Generate a unique identifier for each new product
function generateProductId() {
  if (inventory.length === 0) {
    return 1;
  } else {
    const maxId = Math.max(...inventory.map(product => product.id));
    return maxId + 1;
  }
}

// Add a new product to the inventory
app.post('/products', (req, res) => {
  const { name, description, price, quantity } = req.body;
  const product = {
    id: generateProductId(),
    name,
    description,
    price,
    quantity
  };
  inventory.push(product);
  res.status(201).json(product);
});

// Retrieve product information by ID
app.get('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const product = inventory.find(product => product.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Update product details by ID
app.put('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const { name, description, price, quantity } = req.body;
  const product = inventory.find(product => product.id === productId);
  if (product) {
    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Delete product by ID
app.delete('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const index = inventory.findIndex(product => product.id === productId);
  if (index !== -1) {
    inventory.splice(index, 1);
    res.json({ message: 'Product deleted' });
  } else {
    // if product not found then return the error.
    res.status(404).json({ error: 'Product not found' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});