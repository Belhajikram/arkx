const mongoose = require("mongoose");
const { timestamps } = require("mongodb");
const express = require("express");
const app = express();



mongoose
  .connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log("Error: ", error));


const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    description: {type: String},
    inStock: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    expirationDate: { type: Date }
},
{
    timestamps:true
} 
);


const Product = mongoose.model("Product", ProductSchema);


const addProducts = async() => {
    try {
        const products = await Product.insertMany([
        {
            name: 'Laptop',
            price: 1200,
            description: 'High-performance laptop with powerful specs.',
            inStock: true,
          },
          {
            name: 'Smartphone',
            price: 800,
            description: 'Latest smartphone with advanced features.',
            inStock: true,
          },
          {
            name: 'Headphones',
            price: 150,
            description: 'Over-ear headphones with noise-cancelling technology.',
            inStock: true,
          },
          {
            name: 'Smartwatch',
            price: 250,
            description: 'Fitness tracker and smartwatch with health monitoring.',
            inStock: false,
          },
          {
            name: 'Camera',
            price: 600,
            description: 'Digital camera with high-resolution imaging.',
            inStock: true,
          },
          {
            name: 'Gaming Console',
            price: 400,
            description: 'Next-gen gaming console for immersive gaming experiences.',
            inStock: true,
          },
          {
            name: 'Bluetooth Speaker',
            price: 80,
            description: 'Portable Bluetooth speaker with crisp sound.',
            inStock: true,
          },
          {
            name: 'Tablet',
            price: 300,
            description: 'Slim and lightweight tablet for on-the-go productivity.',
            inStock: true,
          },
          {
            name: 'Coffee Maker',
            price: 50,
            description: 'Automatic coffee maker for brewing your favorite coffee.',
            inStock: true,
          },
          {
            name: 'Fitness Tracker',
            price: 100,
            description: 'Wearable fitness tracker with heart rate monitoring.',
            inStock: false,
          },
          {
            name: 'External Hard Drive',
            price: 120,
            description: 'Large-capacity external hard drive for data storage.',
            inStock: true,
          },
          {
            name: 'Wireless Mouse',
            price: 30,
            description: 'Ergonomic wireless mouse for comfortable computing.',
            inStock: true,
          },
          {
            name: 'Iphone',
            price: 8000,
            description: 'Expensive mobile phone.',
            inStock: true,
            expirationDate: new Date("2023-12-31") 
        }
     ])
     console.log("Products are created succesfully: ", products)
    } catch (error) {
        console.log(error);
    }
}

const SortProductsByPrice = async() => {
    try {
        const products = await Product.find().sort({ price: -1 });
        console.log("Sorted products by price: " , products);
    } catch (error) {
        console.log(error);
    }
}

const limitingProducts = async () => {
    try {
        const products = await Product.find()
            .limit(5);
        console.log(products);
    } catch (error) {
        console.log(error);
    }
}

const customedProducts = async () => {
    try {
        const pageSize = 2;
        const pageNumber = 3;
        const products = await Product.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        console.log(products);
    } catch (error) {
        console.log(error);
    }
}

const countedProducts = async () => {
    try {
        const result = await Product.aggregate([
            { $match: { inStock: true } }, 
            { $group: { _id: null, count: { $sum: 1 } } } 
        ]);
        console.log(result);

        // const count = result.length > 0 ? result[0].count : 0;
        let count;
        if (result.length>0){
            count = result[0].count;
        } else {
            count = 0
        }
        console.log("Number of products in stock:", count);
    } catch (error) {
        console.error("Error counting products in stock:", error);
    }
};

const calculatedPrice = async () => {
    try {
        const result = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: "$price" }
                }
            }
        ]);
        if (result.length > 0) {
            console.log("Average price of all products:", result[0].averagePrice);
        } else {
            console.log("No products found.");
        }
    } catch (error) {
        console.error("Error calculating average price:", error);
    }
};

const sortProductsByName = async () => {
    try {
        const sortedProducts = await Product.find().sort({ name: 1 });
        console.log("Sorted products by name :", sortedProducts);
    } catch (error) {
        console.error("Error sorting products by name:", error);
    }
};

const paginatedProducts = async (dynamicPageSize) => {
    try {
        // const dynamicPageSize = 4;
        const pageNumber = 3;
        const products = await Product.find()
            .skip((pageNumber - 1) * dynamicPageSize)
            .limit(dynamicPageSize);
        console.log(products);
    } catch (error) {
        console.log(error);
    }
}

// -------------------------------------------------------------------------

const updatedPrice = async() => {
    try {
        const price = 1500;
        await Product.updateOne({name: 'Laptop'}, {$set: {price: price}});
        const updated = await Product.find({name: 'Laptop'});
        if (updated.length === 0) {
            console.log("Product is not found");
        } else {
            console.log("The updated product is: ", updated);
        }
    } catch (error) {
        console.log(error);
    }
}

// updatedPrice();

const softDelete = async (name) => {
    await Product.updateOne({name: name}, {$set: {isDeleted: true}});
    const deleted = await Product.findOne({name});
    if (!deleted) {
        console.log("Product is not found");
    } else {
        console.log("The soft deleted product is: ", deleted);
    }
}

// softDelete('Coffee Maker')

const deleteExpiredProducts = async () => {
    try {
        const currentDate = new Date();
        const result = await Product.deleteMany({ expirationDate: { $lte: currentDate } });
        console.log("Number of hard deleted products:", result.deletedCount);
    } catch (error) {
        console.log(error);
    }
}

// deleteExpiredProducts();

const updatedProducts = async () => {
    await Product.updateMany({ inStock: true}, {$set: {description: 'All products in stock are updated'}});
    const updated = await Product.find({inStock: true});
    if(updated.length === 0){
        console.log("No products were updated");
    } else {
        console.log("Number of products updated: ", updated.length);
    }
}

// updatedProducts();

const deletedProducts = async () => {
    const deleted = await Product.deleteMany({ inStock: false });
    if (deleted.deletedCount === 0){
        console.log("No products were deleted");
    } else {
        console.log("Number of products deleted: ", deleted.deletedCount);
    }
}

// deletedProducts();


// addProducts()
// SortProductsByPrice();
// limitingProducts();
// customedProducts();
// countedProducts();
// calculatedPrice();
// sortProductsByName();
// paginatedProducts(4);

app.listen(3000, () =>{
    console.log("Server is running on 3000");
});