/**
 * Express app factory — accepts Mongoose model instances so tests can inject
 * models bound to an in-memory connection instead of the real Atlas cluster.
 *
 * Usage (production):
 *   const { Vehicle, MaintenanceTask } = require('./models');
 *   const app = createApp(Vehicle, MaintenanceTask);
 *
 * Usage (tests):
 *   const app = createApp(VehicleModel, TaskModel);  // bound to memory-server
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

function createApp(Vehicle, MaintenanceTask) {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  // ── Vehicle Routes ────────────────────────────────────────────────────────

  app.get('/api/vehicles', (req, res) => {
    Vehicle.find({})
      .then(vehicles => res.status(200).json(vehicles))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  app.get('/api/vehicles/:id', (req, res) => {
    Vehicle.findById(req.params.id)
      .then(vehicle => {
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(vehicle);
      })
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // Feature: auto-sentry-completion, Property 14
  app.post('/api/vehicles', (req, res) => {
    Vehicle.create(req.body)
      .then(vehicle => res.status(201).json(vehicle))
      .catch(error => {
        if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
      });
  });

  app.put('/api/vehicles/updateVehicle/:id', (req, res) => {
    const id = req.params.id;
    Vehicle.findByIdAndUpdate(
      { _id: id },
      { user: req.body.user, make: req.body.make, model: req.body.model, year: req.body.year, modification: req.body.modification, image: req.body.image }
    )
      .then(vehicles => res.status(200).json(vehicles))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  app.delete('/api/vehicles/deleteVehicle/:id', (req, res) => {
    const id = req.params.id;
    Vehicle.findByIdAndDelete({ _id: id })
      .then(vehicle => {
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(vehicle);
      })
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // ── Task Routes ───────────────────────────────────────────────────────────

  app.get('/api/tasks', (req, res) => {
    MaintenanceTask.find({})
      .then(tasks => res.status(200).json(tasks))
      .catch(error => res.status(500).json({ message: 'Internal server error' }));
  });

  // Feature: auto-sentry-completion, Property 15
  app.get('/api/tasks/byVehicle/:vehicleId', (req, res) => {
    const vehicleId = req.params.vehicleId;
    MaintenanceTask.find({ vehicleId })
      .then(tasks => res.status(200).json(tasks))
      .catch(error => res.status(500).json({ message: 'Internal server error' }));
  });

  app.post('/api/tasks', (req, res) => {
    MaintenanceTask.create(req.body)
      .then(task => res.status(201).json(task))
      .catch(error => {
        if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  app.put('/api/tasks/:id', (req, res) => {
    MaintenanceTask.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedTask => {
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
      })
      .catch(error => {
        if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  app.delete('/api/tasks/:id', (req, res) => {
    MaintenanceTask.findByIdAndDelete(req.params.id)
      .then(deletedTask => {
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
      })
      .catch(error => res.status(500).json({ message: 'Internal server error' }));
  });

  return app;
}

module.exports = createApp;
