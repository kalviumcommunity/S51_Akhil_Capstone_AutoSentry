const mongoose = require("mongoose");

const VehicleSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    modification: {
      type: String,
      required: true,
    },
    vin: {
      type: Number,
      required: true,
    },
    image: {
      data: Buffer, 
      contentType: String,
    }
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
