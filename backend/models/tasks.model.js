const mongoose = require('mongoose');

// Define schema for maintenance tasks
const maintenanceTaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  }
});

// Create a model for maintenance tasks
const MaintenanceTask = mongoose.model('MaintenanceTask', maintenanceTaskSchema);

module.exports = MaintenanceTask;
