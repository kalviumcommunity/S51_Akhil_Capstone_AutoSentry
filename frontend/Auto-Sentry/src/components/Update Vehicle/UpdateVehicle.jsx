import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import './updateVehicle.css';
import { toast } from 'react-toastify';
import { FaCar, FaHashtag, FaCalendarAlt, FaTools, FaLink, FaSave } from 'react-icons/fa';

const UpdateVehicle = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [make, setMake]               = useState('');
  const [model, setModel]             = useState('');
  const [year, setYear]               = useState('');
  const [modification, setModification] = useState('');
  const [vin, setVin]                 = useState('');
  const [image, setImage]             = useState('');
  const [user, setUser]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(true);

  useEffect(() => {
    axios
      .get('/api/vehicles/' + id)
      .then(res => {
        setUser(res.data.user ?? '');
        setMake(res.data.make ?? '');
        setModel(res.data.model ?? '');
        setYear(res.data.year ?? '');
        setModification(res.data.modification ?? '');
        setVin(res.data.vin ?? '');
        setImage(res.data.image ?? '');
      })
      .catch(() => toast.error('Failed to load vehicle data'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put('/api/vehicles/updateVehicle/' + id, { user, make, model, year, modification, vin, image })
      .then(() => {
        toast.success('Vehicle updated');
        setTimeout(() => navigate('/garage'), 900);
      })
      .catch(() => toast.error('Failed to update vehicle'))
      .finally(() => setLoading(false));
  };

  const fields = [
    { id: 'uv-make',  label: 'Make',         icon: <FaCar />,         type: 'text',   value: make,         set: setMake,         placeholder: 'e.g. Toyota' },
    { id: 'uv-model', label: 'Model',        icon: <FaCar />,         type: 'text',   value: model,        set: setModel,        placeholder: 'e.g. Camry' },
    { id: 'uv-year',  label: 'Year',         icon: <FaCalendarAlt />, type: 'number', value: year,         set: setYear,         placeholder: 'e.g. 2020' },
    { id: 'uv-mod',   label: 'Modification', icon: <FaTools />,       type: 'text',   value: modification, set: setModification, placeholder: 'e.g. Sport' },
    { id: 'uv-vin',   label: 'VIN',          icon: <FaHashtag />,     type: 'text',   value: vin,          set: setVin,          placeholder: '17-character VIN' },
    { id: 'uv-img',   label: 'Image URL',    icon: <FaLink />,        type: 'url',    value: image,        set: setImage,        placeholder: 'https://…' },
  ];

  return (
    <div className="uv-page">
      {/* Header */}
      <div className="uv-header">
        <div className="uv-header-inner">
          <div>
            <span className="uv-eyebrow">My Garage</span>
            <h1 className="uv-title">Update Vehicle</h1>
            <p className="uv-subtitle">Edit your vehicle's details below</p>
          </div>
          <NavLink to="/garage" className="uv-back-btn">← Back to Garage</NavLink>
        </div>
      </div>

      {/* Body */}
      <div className="uv-body">
        <div className="uv-card">
          <div className="uv-card-header">
            <FaCar className="uv-card-icon" />
            <h2>
              {make && model
                ? `${make} ${model}`
                : 'Vehicle Details'}
            </h2>
          </div>

          {fetching ? (
            <div className="uv-loading">
              <div className="uv-spinner" />
              <p>Loading vehicle data…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="uv-form">

              {/* Image preview at top */}
              {image && (
                <div className="uv-img-preview">
                  <img src={image} alt="Vehicle" onError={e => e.target.style.display = 'none'} />
                  <div className="uv-img-label">{make} {model} · {year}</div>
                </div>
              )}

              <div className="uv-form-grid">
                {fields.map(f => (
                  <div className="uv-field" key={f.id}>
                    <label htmlFor={f.id}>
                      <span className="uv-field-icon">{f.icon}</span>
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      className="uv-input"
                      placeholder={f.placeholder}
                      value={f.value ?? ''}
                      onChange={e => f.set(e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="uv-form-footer">
                <NavLink to="/garage" className="uv-cancel-btn">Cancel</NavLink>
                <button type="submit" className="uv-submit-btn" disabled={loading}>
                  {loading ? 'Saving…' : <><FaSave /> Save Changes</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateVehicle;
