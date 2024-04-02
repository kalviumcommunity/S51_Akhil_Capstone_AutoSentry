const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const Vehicle = require('./models/vehicles.model');
const cors = require('cors');
const { error } = require('console');

const app = express();

app.use(cors());

app.use(bodyParser.json()); 
app.use(express.static('website'));

app.get('/', welcome);

function welcome(req, res) {
    res.send("Welcome to my Capstone project!");
}

app.get('/api/vehicles', (req, res) => {
    Vehicle.find({})
      .then(vehicles => {
        res.status(200).json(vehicles);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  });

app.get('/api/vehicles/:id', (req, res) => {
    const id = req.params.id;
    Vehicle.findById(id)
      .then(vehicle => {
        if (!vehicle) {
          return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json(vehicle);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  });

app.post('/api/vehicles', (req, res) => {
    Vehicle.create(req.body)
      .then(vehicle => {
        console.log('Vehicle created:', vehicle);
        res.status(201).json(vehicle);
      })
      .catch(error => {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ message: error.message });
      });
  });

app.put('/api/vehicles/updateVehicle/:id',(req, res)=>{
    const id = req.params.id;
    Vehicle.findByIdAndUpdate({_id:id}, {user: req.body.user, make: req.body.make, model: req.body.model, year: req.body.year, modification: req.body.modification, image: req.body.image})
    .then(vehicles => {
        res.status(200).json(vehicles);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
})

app.delete('/api/vehicles/deleteVehicle/:id',(req,res)=>{
    const id = req.params.id;
    Vehicle.findByIdAndDelete({_id:id})
    .then(vehicles => {
        res.status(200).json(vehicles);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
})

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
