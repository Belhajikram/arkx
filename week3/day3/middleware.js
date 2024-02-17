const express = require("express");
const app = express();
const port = 6000;

app.use(express.json());

const logger = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${method} ${url}`);
  next();
};

app.use(logger);

let products = [
  { id: 1, name: "iPhone 12 Pro", price: 1099.99 },
  { id: 2, name: "Samsung Galaxy S21", price: 999.99 },
  { id: 3, name: "Sony PlayStation 5", price: 499.99 },
  { id: 4, name: "MacBook Pro 16", price: 2399.99 },
  { id: 5, name: "DJI Mavic Air 2", price: 799.99 },
];

app.get("/products", (req, res, next) => {
  res.send(products);
  next();
});

app.get("/products/search", (req, res) => {
  const { q, minPrice, maxPrice } = req.query;
  let filteredProducts = products;
  if (q) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= parseInt(minPrice)
    );
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= parseInt(maxPrice)
    );
  }

  res.send(filteredProducts);
});

app.get("/products/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const result = products.find((elm) => elm.id == id);
    if (result) {
      res.json(result);
    } else {
      throw new Error("product not found");
    }
  } catch (error) {
    next(error);
  }
});

app.post("/products", (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      throw new Error("Name and price are required fields");
    }
    const newProduct = {
      id: products.length + 1,
      name: name,
      price: price,
    };
    products.push(newProduct);
    res.send(newProduct);
  } catch (error) {
    next(error);
  }
});

app.put("/products/:id", (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex == -1) {
      throw new Error("Product not found11");
    }
    if (!req.body.name || !req.body.price) {
      throw new Error("name and price are required");
    }
    const { name, price } = req.body;
    products[productIndex] = {
      id: products[productIndex].id,
      name,
      price,
    };
    res.send(products[productIndex]);
  } catch (error) {
    next(error);
  }
});

app.delete("/products/:id", (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((product) => product.id === productId );
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    res.json(products[productIndex]);
    products.splice(productIndex, 1);
    console.log("product has been deleted");
  } catch (error) {
    next(error);
  }
});

const errorhandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).send(err.message);
};

app.use(errorhandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
