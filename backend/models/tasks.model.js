const mongoose = require("mongoose");
const { type } = require("os");

const maintenanceTaskSchema = new mongoose.Schema({
  user: {
    type: String,
    required: false,
  },
  vehicleId: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  taskStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
}, {
  timestamps: true,
});

// Create a model for maintenance tasks
const MaintenanceTask = mongoose.model(
  "MaintenanceTask",
  maintenanceTaskSchema
);

module.exports = MaintenanceTask;