
import React, { useState } from 'react';
import './addnew.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddNew = () => {
  const [user, setUser] = useState()
  const [make, setMake] = useState()
  const [model, setModel] = useState()
  const [year, setYear] = useState()
  const [modification, setModification] = useState()
  const [vin, setVin] = useState()
  const [image, setImage] = useState()
  const navigate = useNavigate()
  
  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/vehicles",{user,make,model,year,modification,vin,image})
    .then(result => {
      console.log(result)
      navigate('/garage')
    })
    .catch(err => console.log(err))
  }
  
  return (
    <div className='form-container'> 
      <div className='form-content'>
        <form onSubmit={Submit}>
          <h2>Add Vehicle</h2>
          <div className='form-group'>
            <label className='form-label' htmlFor='user'>User:</label>
            <input type='text' placeholder='Enter User Name' className='form-control'
            onChange={(e) => setUser(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='make'>Make:</label>
            <input type='text' placeholder='Enter Make' className='form-control'
            onChange={(e) => setMake(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='model'>Model:</label>
            <input type='text' placeholder='Enter Model' className='form-control'
            onChange={(e) => setModel(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='year'>Year:</label>
            <input type='number' placeholder='Enter the Year' className='form-control'
            onChange={(e) => setYear(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='modification'>Modification:</label>
            <input type='text' placeholder='Enter the Modification' className='form-control'
            onChange={(e) => setModification(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='vin'>VIN:</label>
            <input type='number' placeholder='Enter the VIN' className='form-control'
            onChange={(e) => setVin(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='image'>Image URL:</label>
            <input type='text' placeholder='Paste the Vehicle Image URL' className='form-control'
            onChange={(e) => setImage(e.target.value)}/>
          </div>
          <button className='btn-submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddNew;
