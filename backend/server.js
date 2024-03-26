const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const Vehicle = require('./models/vehicles.model');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json()); 
app.use(express.static('website'));

app.get('/', welcome);

function welcome(req, res) {
    res.send("Welcome to my Capstone project!");
}

app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.status(200).json(vehicles)
    }catch{
        res.status(500).json({message: error.message});
    }
}) 

app.post('/api/vehicles', async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        console.log('Vehicle created:', vehicle);
        res.status(201).json(vehicle); 
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ message: error.message });
    }
});

mongoose.connect("mongodb+srv://akhilk49:iamtheadmin@cluster0.jngvggm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to Database!");
        var server = app.listen(5000, starting);

        function starting() {
            console.log("Server started");
        }
    })
    .catch((err) => {
        console.error("Connection failed:", err);
    });
