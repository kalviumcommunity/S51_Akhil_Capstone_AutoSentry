import React, { useState } from 'react';
import './addnew.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Autosuggest from 'react-autosuggest';
import makesAndModels from './makesAndModels.js';

const AddNew = () => {
  const { user, isAuthenticated } = useAuth0();
  const [username, setUsername] = useState(user ? user.nickname : '');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [modification, setModification] = useState('');
  const [vin, setVin] = useState('');
  const [image, setImage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [modelsForMake, setModelsForMake] = useState([]);
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

  const indianCarBrands = Object.keys(makesAndModels);

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : indianCarBrands.filter(
          (brand) => brand.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getModelsForMake = (selectedMake) => {
    return makesAndModels[selectedMake] || [];
  };

  const onChange = (event, { newValue }) => {
    setMake(newValue);
    setModelsForMake(getModelsForMake(newValue));
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const inputProps = {
    placeholder: 'Enter Make',
    value: make,
    onChange: onChange
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
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              />
            </div>
            <div className='form-group'>
              <label className='form-label' htmlFor='model'>Model:</label>
              <select
                className='form-control'
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              >
                <option value=''>Select Model</option>
                {modelsForMake.map((model, index) => (
                  <option key={index} value={model}>{model}</option>
                ))}
              </select>
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
