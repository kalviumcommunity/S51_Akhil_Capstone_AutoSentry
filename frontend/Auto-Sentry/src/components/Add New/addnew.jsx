// AddNew.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './addnew.css'; 

const AddNew = () => {
  const [formData, setFormData] = useState({
    user: '',
    make: '',
    model: '',
    year: 0,
    modification: '',
    vin: 0,
    image: '',
  });

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/vehicles', formData);
      console.log(res.data); // Handle success response
      navigate('/garage');
    } catch (error) {
      console.error('Error adding new vehicle:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="user"
          className="input-field"
          placeholder="User"
          value={formData.user}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="make"
          className="input-field"
          placeholder="Make"
          value={formData.make}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          className="input-field"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          className="input-field"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="modification"
          className="input-field"
          placeholder="Modification"
          value={formData.modification}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="vin"
          className="input-field"
          placeholder="VIN"
          value={formData.vin}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          className="input-field"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit" className="button">
          Add Vehicle 
        </button>
      </form>
    </div>
  );
};

export default AddNew;
