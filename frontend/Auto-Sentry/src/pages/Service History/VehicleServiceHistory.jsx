// VehicleServiceHistory.js

import React, { useState } from 'react';
import './VehicleServiceHistory.css';

const VehicleServiceHistory = () => {
  const [serviceHistory, setServiceHistory] = useState([]);
  const [newService, setNewService] = useState({
    date: '',
    description: '',
    cost: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value,
    });
  };

  const handleAddService = () => {
    setServiceHistory([...serviceHistory, newService]);
    setNewService({
      date: '',
      description: '',
      cost: '',
    });
  };

  return (
    <div className="service-history-container">
      <h2>Vehicle Service History</h2>
      <div className="service-form">
        <input
          type="date"
          name="date"
          value={newService.date}
          onChange={handleInputChange}
          placeholder="Date"
        />
        <input
          type="text"
          name="description"
          value={newService.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="cost"
          value={newService.cost}
          onChange={handleInputChange}
          placeholder="Cost"
        />
        <button onClick={handleAddService}>Add Service</button>
      </div>
      <div className="service-list">
        <h3>Service History</h3>
        <ul>
          {serviceHistory.map((service, index) => (
            <li key={index}>
              <span>Date: {service.date}</span>
              <span>Description: {service.description}</span>
              <span>Cost: ${service.cost}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VehicleServiceHistory;
