const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const Vehicle = require('./models/vehicles.model');
const MaintenanceTask = require('./models/tasks.model')
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.static('website'));

// First Database Connection
mongoose.connect("mongodb+srv://akhilk49:iamtheadmin@cluster0.jngvggm.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to First Database!");
    startServer();
  })
  .catch((err) => {
    console.error("First Database Connection failed:", err);
  });

// Task Database Connection
const secondDBConnection = mongoose.createConnection("mongodb+srv://akhilk49:iamtheadmin@cluster0.jngvggm.mongodb.net/tasks?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true });

secondDBConnection.on('error', console.error.bind(console, 'Second Database Connection Error:'));
secondDBConnection.once('open', function () {
  console.log('Connected to Second Database!');

  // GET all tasks
  app.get('/api/tasks', (req, res) => {
    MaintenanceTask.find({})
      .then(tasks => {
        res.status(200).json(tasks);
      })
      .catch(error => {
        console.error('Error fetching maintenance tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  app.get('/api/tasks/byVehicle/:vehicleId', (req, res) => {
    const vehicleId = req.params.vehicleId;
    MaintenanceTask.find({ vehicleId: vehicleId })
      .then(tasks => {
        if (!tasks) {
          return res.status(404).json({ message: 'No tasks found for this vehicle' });
        }
        res.status(200).json(tasks);
      })
      .catch(error => {
        console.error('Error fetching maintenance tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  // POST a new task
  app.post('/api/tasks', (req, res) => {
    MaintenanceTask.create(req.body)
      .then(task => {
        console.log('Maintenance Task created:', task);
        res.status(201).json(task);
      })
      .catch(error => {
        console.error('Error creating maintenance task:', error);
        if (error.name === 'ValidationError') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      });
  });

  // Update a task
  app.put('/api/tasks/:id', (req, res) => {
    MaintenanceTask.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedTask => {
        if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        console.log('Maintenance Task updated:', updatedTask);
        res.status(200).json(updatedTask);
      })
      .catch(error => {
        console.error('Error updating maintenance task:', error);
        if (error.name === 'ValidationError') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      });
  });

  // Delete a task
  app.delete('/api/tasks/:id', (req, res) => {
    MaintenanceTask.findByIdAndDelete(req.params.id)
      .then(deletedTask => {
        if (!deletedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        console.log('Maintenance Task deleted:', deletedTask);
        res.status(200).json({ message: 'Task deleted successfully' });
      })
      .catch(error => {
        console.error('Error deleting maintenance task:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });
});


// Routes for Vehicle DB Database
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
});

app.delete('/api/vehicles/deleteVehicle/:id',(req,res)=>{
    const id = req.params.id;
    Vehicle.findByIdAndDelete({_id:id})
    .then(vehicles => {
        res.status(200).json(vehicles);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
});

function startServer() {
    var server = app.listen(5000, () => {
        console.log("Server started");
    });
}
