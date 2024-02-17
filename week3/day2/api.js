const express = require('express');
const app = express();
const port = 5000;


app.use(express.json())

let products = [
    { id: 1, name: 'iPhone 12 Pro', price: 1099.99 },
    { id: 2, name: 'Samsung Galaxy S21', price: 999.99 },
    { id: 3, name: 'Sony PlayStation 5', price: 499.99 },
    { id: 4, name: 'MacBook Pro 16', price: 2399.99 },
    { id: 5, name: 'DJI Mavic Air 2', price: 799.99 },
  ];

app.get("/products", (req,res) => {
    res.send(products);
});

app.get('/products/search', (req, res) => {
    const { q, minPrice, maxPrice } = req.query;
    let filteredProducts = products;
    if (q) {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(q.toLowerCase()));
    }
    if (minPrice) {
        filteredProducts = filteredProducts.filter(product => product.price >= parseInt(minPrice));
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(product => product.price <= parseInt(maxPrice));
    }
    res.send(filteredProducts);
});

app.get("/products/:id", (req,res) => {
    const id = req.params.id;
    const result = products.find((elm) => elm.id == id);
    res.send(result);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required fields" });
    }
    const newProduct = {
        id: products.length + 1, 
        name: name,
        price: price
    };
    products.push(newProduct);
    res.send(newProduct);
    console.log(newProduct);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;
    const productToUpdate = products.find(product => product.id === productId);
    if (!productToUpdate) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (name) {
        productToUpdate.name = name;
    }
    if (price) {
        productToUpdate.price = price;
    }
    res.send(productToUpdate);
    console.log(productToUpdate);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }
    products.splice(productIndex, 1);
    res.send(productIndex);

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
