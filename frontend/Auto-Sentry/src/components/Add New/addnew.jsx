import React, { useState } from 'react';
import './addnew.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AddNew = () => {
  const { user, isAuthenticated } = useAuth0();
  const [username, setUsername] = useState(user ? user.nickname : '');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [modification, setModification] = useState('');
  const [vin, setVin] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/vehicles", {
        user: username,
        make,
        model,
        year,
        modification,
        vin,
        image
      })
      .then(result => {
        console.log(result);
        toast.success("Vehicle Created Successfully");
        setTimeout(() => {
          navigate("/garage");
        }, 1000);
      })
      .catch(err => console.log(err));
  };

  return (
    isAuthenticated && (
      <div className='form-container'> 
        <ToastContainer />
        <div className='form-content'>
          <form onSubmit={handleSubmit}>
            <h2>Add Vehicle</h2>
            <div className='form-group'>
              <label className='form-label' htmlFor='make'>Make:</label>
              <input
                type='text'
                placeholder='Enter Make'
                className='form-control'
                value={make}
                onChange={(e) => setMake(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='model'>Model:</label>
              <input
                type='text'
                placeholder='Enter Model'
                className='form-control'
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='year'>Year:</label>
              <input
                type='number'
                placeholder='Enter the Year'
                className='form-control'
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='modification'>Modification:</label>
              <input
                type='text'
                placeholder='Enter the Modification'
                className='form-control'
                value={modification}
                onChange={(e) => setModification(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='vin'>VIN:</label>
              <input
                type='number'
                placeholder='Enter the VIN'
                className='form-control'
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='image'>Image URL:</label>
              <input
                type='text'
                placeholder='Paste the Vehicle Image URL'
                className='form-control'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
            <button type="submit" className='btn-submit'>Submit</button>
          </form>
        </div>
      </div>
    )
  );
};

export default AddNew;
