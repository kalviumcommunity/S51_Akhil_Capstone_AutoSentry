import { useState } from 'react';
import './addnew.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import Autosuggest from 'react-autosuggest';
import makesAndModels from './makesAndModels.js';
import { FaCar, FaHashtag, FaCalendarAlt, FaTools, FaLink } from 'react-icons/fa';

const AddNew = () => {
  const { user, isAuthenticated } = useAuth0();
  const username = user?.nickname ?? '';
  const navigate  = useNavigate();

  const [make, setMake]               = useState('');
  const [model, setModel]             = useState('');
  const [year, setYear]               = useState('');
  const [modification, setModification] = useState('');
  const [vin, setVin]                 = useState('');
  const [image, setImage]             = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [modelsForMake, setModelsForMake] = useState([]);
  const [loading, setLoading]         = useState(false);

  const allMakes = Object.keys(makesAndModels);

  const getModelsForMake = (m) => makesAndModels[m] || [];

  const onChange = (_e, { newValue }) => {
    setMake(newValue);
    setModelsForMake(getModelsForMake(newValue));
    setModel('');
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    const v = value.trim().toLowerCase();
    setSuggestions(v.length === 0 ? [] : allMakes.filter(b => b.toLowerCase().startsWith(v)));
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);
  const getSuggestionValue          = (s) => s;
  const renderSuggestion            = (s) => <div>{s}</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post('/api/vehicles', { user: username, make, model, year, modification, vin, image })
      .then(() => {
        toast.success('Vehicle added to your garage');
        setTimeout(() => navigate('/garage'), 900);
      })
      .catch(() => toast.error('Failed to add vehicle'))
      .finally(() => setLoading(false));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="av-page">
      {/* Header */}
      <div className="av-header">
        <div className="av-header-inner">
          <div>
            <span className="av-eyebrow">My Garage</span>
            <h1 className="av-title">Add Vehicle</h1>
            <p className="av-subtitle">Register a new vehicle to start tracking maintenance</p>
          </div>
          <NavLink to="/garage" className="av-back-btn">← Back to Garage</NavLink>
        </div>
      </div>

      {/* Body */}
      <div className="av-body">
        <div className="av-card">
          <div className="av-card-header">
            <FaCar className="av-card-icon" />
            <h2>Vehicle Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="av-form">
            <div className="av-form-grid">

              {/* Make — autosuggest */}
              <div className="av-field av-field--full">
                <label htmlFor="av-make">
                  <FaCar className="av-field-icon" /> Make
                </label>
                <div className="av-autosuggest-wrap">
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                      id: 'av-make',
                      placeholder: 'e.g. Toyota, Honda, BMW…',
                      value: make,
                      onChange,
                      className: 'av-input',
                    }}
                    theme={{
                      container: 'av-autosuggest',
                      suggestionsContainer: 'av-suggestions-container',
                      suggestionsList: 'av-suggestions-list',
                      suggestion: 'av-suggestion',
                      suggestionHighlighted: 'av-suggestion--highlighted',
                    }}
                  />
                </div>
              </div>

              {/* Model */}
              <div className="av-field">
                <label htmlFor="av-model">
                  <FaCar className="av-field-icon" /> Model
                </label>
                {modelsForMake.length > 0 ? (
                  <select
                    id="av-model"
                    className="av-input"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    required
                  >
                    <option value="">Select model</option>
                    {modelsForMake.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="av-model"
                    type="text"
                    className="av-input"
                    placeholder="Enter model"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    required
                  />
                )}
              </div>

              {/* Year */}
              <div className="av-field">
                <label htmlFor="av-year">
                  <FaCalendarAlt className="av-field-icon" /> Year
                </label>
                <input
                  id="av-year"
                  type="number"
                  className="av-input"
                  placeholder="e.g. 2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  required
                />
              </div>

              {/* Modification */}
              <div className="av-field">
                <label htmlFor="av-mod">
                  <FaTools className="av-field-icon" /> Modification
                </label>
                <input
                  id="av-mod"
                  type="text"
                  className="av-input"
                  placeholder="e.g. Sport, Turbo, Base"
                  value={modification}
                  onChange={e => setModification(e.target.value)}
                  required
                />
              </div>

              {/* VIN */}
              <div className="av-field">
                <label htmlFor="av-vin">
                  <FaHashtag className="av-field-icon" /> VIN
                </label>
                <input
                  id="av-vin"
                  type="text"
                  className="av-input"
                  placeholder="17-character VIN"
                  value={vin}
                  onChange={e => setVin(e.target.value)}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="av-field">
                <label htmlFor="av-img">
                  <FaLink className="av-field-icon" /> Image URL
                </label>
                <input
                  id="av-img"
                  type="url"
                  className="av-input"
                  placeholder="https://…"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                />
              </div>

            </div>

            {/* Image preview */}
            {image && (
              <div className="av-img-preview">
                <img src={image} alt="Vehicle preview" onError={e => e.target.style.display='none'} />
              </div>
            )}

            <div className="av-form-footer">
              <NavLink to="/garage" className="av-cancel-btn">Cancel</NavLink>
              <button type="submit" className="av-submit-btn" disabled={loading}>
                {loading ? 'Adding…' : <><FaCar /> Add to Garage</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNew;
