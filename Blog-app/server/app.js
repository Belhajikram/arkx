const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./Routes/userRoutes');
const postRouter = require('./Routes/postRoutes');
const app = express();


const PORT = process.env.PORT;
const URL = process.env.URL;


app.use(express.json());
app.use(userRouter);
app.use(postRouter);

const connection = async () => {
    try {
        await mongoose.connect(URL)
        console.log("Connected to the database");
    } catch (error) {
        console.log(error);
    }
    
}
connection();




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

