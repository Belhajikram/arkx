const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');


const Register = async (req,res) => {
    try {
        const { username, password, email} = req.body;
        if (!username || !email || !password){
            return res.status(400).json({ message: "Invalid input. Username, email and password are required"});
        }
        const hashedPassword = await bycrpt.hash(password, 10);
        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email
        })
        await newUser.save();
        res.status(200).json({ message: "Registered Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error"});
    }
}

const secretKey = 'mysecret';
const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Username is wrong" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Password is wrong" });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, 'secret_key', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({ message: "Login successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}; 

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedToken = jwt.verify(token, 'secretKey');
        req.userData = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const createPost = async (req, res) => {
    try {
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
module.exports = {
    Register,
    Login,
    verifyToken,
    createPost
};
