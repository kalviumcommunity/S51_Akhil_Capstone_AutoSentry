import { useState, useEffect, useRef } from 'react';
import './VehicleServiceHistory.css';
import { imgDB, txtDB } from './Historyconfig';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaWrench, FaCalendarAlt, FaTachometerAlt, FaDollarSign, FaTrash, FaImage, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const EMPTY_FORM = {
  service: '',
  serviceDate: '',
  mileage: '',
  cost: '',
  description: '',
  image: '',
  vehicleId: '',
};

const VehicleServiceHistory = () => {
  const { user, isAuthenticated } = useAuth0();
  const [currentUser, setCurrentUser] = useState('');
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]             = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [deleteId, setDeleteId]       = useState(null);
  const [expandedId, setExpandedId]   = useState(null);
  const [formOpen, setFormOpen]       = useState(true);
  const fileInputRef                  = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user?.nickname) setCurrentUser(user.nickname);
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageRef = ref(imgDB, `Imgs/${v4()}`);
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { service, serviceDate, mileage, cost, description, image, vehicleId } = formData;
    setLoading(true);
    try {
      const dataRef = collection(txtDB, 'txtData');
      const docRef  = await addDoc(dataRef, {
        user: currentUser, service, serviceDate, mileage, cost, description, image, vehicleId,
      });
      setData(prev => [{ ...formData, id: docRef.id, user: currentUser }, ...prev]);
      setFormData(EMPTY_FORM);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Service record added');
    } catch (err) {
      toast.error('Failed to add record');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(txtDB, 'txtData', id));
      setData(prev => prev.filter(r => r.id !== id));
      setDeleteId(null);
      toast.success('Record deleted');
    } catch (err) {
      toast.error('Failed to delete record');
      setError(err.message);
    }
  };

  const getData = async () => {
    setFetchLoading(true);
    try {
      const dataRef = collection(txtDB, 'txtData');
      const q       = query(dataRef, where('user', '==', currentUser));
      const snap    = await getDocs(q);
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (!isAuthenticated) return null;

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  const formatCost = (c) => {
    if (!c) return '—';
    const n = parseFloat(c);
    return isNaN(n) ? c : `₹${n.toLocaleString()}`;
  };

  return (
    <div className="sh-page">

      {/* ── HEADER ── */}
      <div className="sh-header">
        <div className="sh-header-inner">
          <div>
            <span className="sh-eyebrow">Maintenance Records</span>
            <h1 className="sh-title">Service History</h1>
            <p className="sh-subtitle">
              {data.length} record{data.length !== 1 ? 's' : ''} logged
            </p>
          </div>
          <NavLink to="/garage" className="sh-back-btn">← Back to Garage</NavLink>
        </div>
      </div>

      <div className="sh-body">

        {/* ── STATS ── */}
        {data.length > 0 && (
          <div className="sh-stats">
            <div className="sh-stat-card">
              <span className="sh-stat-num" style={{ color: '#0a2640' }}>{data.length}</span>
              <span className="sh-stat-lbl">Total Records</span>
            </div>
            <div className="sh-stat-card">
              <span className="sh-stat-num" style={{ color: '#5de0a5' }}>
                {data.reduce((s, r) => s + (parseFloat(r.cost) || 0), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="sh-stat-lbl">Total Cost (₹)</span>
            </div>
            <div className="sh-stat-card">
              <span className="sh-stat-num" style={{ color: '#f59e0b' }}>
                {data[0]?.serviceDate ? formatDate(data[0].serviceDate) : '—'}
              </span>
              <span className="sh-stat-lbl">Last Service</span>
            </div>
            <div className="sh-stat-card">
              <span className="sh-stat-num" style={{ color: '#6366f1' }}>
                {Math.max(...data.map(r => parseFloat(r.mileage) || 0)).toLocaleString()}
              </span>
              <span className="sh-stat-lbl">Highest Mileage</span>
            </div>
          </div>
        )}

        {/* ── ADD RECORD FORM ── */}
        <div className="sh-form-card">
          <button className="sh-form-toggle" onClick={() => setFormOpen(o => !o)}>
            <div className="sh-form-toggle-left">
              <FaPlus className="sh-form-icon" />
              <h2>Add New Record</h2>
            </div>
            {formOpen ? <FaChevronUp className="sh-chevron" /> : <FaChevronDown className="sh-chevron" />}
          </button>

          {formOpen && (
            <form onSubmit={handleSubmit} className="sh-form">
              <div className="sh-form-grid">
                <div className="sh-field">
                  <label htmlFor="sh-service">Service Type</label>
                  <input id="sh-service" type="text" name="service" placeholder="e.g. Oil Change" value={formData.service} onChange={handleChange} required />
                </div>
                <div className="sh-field">
                  <label htmlFor="sh-date">Service Date</label>
                  <input id="sh-date" type="date" name="serviceDate" value={formData.serviceDate} onChange={handleChange} required />
                </div>
                <div className="sh-field">
                  <label htmlFor="sh-mileage">Mileage (km)</label>
                  <input id="sh-mileage" type="number" name="mileage" placeholder="e.g. 45000" value={formData.mileage} onChange={handleChange} />
                </div>
                <div className="sh-field">
                  <label htmlFor="sh-cost">Cost (₹)</label>
                  <input id="sh-cost" type="number" name="cost" placeholder="e.g. 2500" value={formData.cost} onChange={handleChange} />
                </div>
                <div className="sh-field sh-field--full">
                  <label htmlFor="sh-desc">Description</label>
                  <textarea id="sh-desc" name="description" placeholder="Notes about the service…" value={formData.description} onChange={handleChange} rows={3} />
                </div>
                <div className="sh-field sh-field--full">
                  <label>Receipt / Photo</label>
                  <label htmlFor="sh-img" className="sh-file-label">
                    <FaImage />
                    {formData.image
                      ? <span className="sh-file-uploaded">✓ Image uploaded</span>
                      : uploading
                        ? <span>Uploading…</span>
                        : <span>Click to choose a file</span>
                    }
                  </label>
                  <input id="sh-img" type="file" accept="image/*" onChange={handleUpload} ref={fileInputRef} className="sh-file-hidden" />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="sh-img-preview" />
                  )}
                </div>
              </div>
              <div className="sh-form-footer">
                <button type="submit" className="sh-submit-btn" disabled={loading || uploading}>
                  {loading ? 'Saving…' : <><FaPlus /> Add Record</>}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── HISTORY LIST ── */}
        <div className="sh-list-card">
          <div className="sh-list-header">
            <h2>Your Service History</h2>
            <span className="sh-record-count">{data.length} records</span>
          </div>

          {error && <p className="sh-error" role="alert">{error}</p>}

          {fetchLoading && (
            <div className="sh-loading">
              <div className="sh-spinner" />
              <p>Loading records…</p>
            </div>
          )}

          {!fetchLoading && data.length === 0 && (
            <div className="sh-empty">
              <FaWrench className="sh-empty-icon" />
              <h3>No records yet</h3>
              <p>Add your first service record using the form above.</p>
            </div>
          )}

          {!fetchLoading && data.length > 0 && (
            <div className="sh-records">
              {data.map((r) => (
                <div key={r.id} className="sh-record">
                  <div className="sh-record-left">
                    <div className="sh-record-icon-wrap">
                      <FaWrench className="sh-record-icon" />
                    </div>
                  </div>
                  <div className="sh-record-main">
                    <div className="sh-record-top">
                      <div className="sh-record-title-group">
                        <h3 className="sh-record-title">{r.service || 'Service'}</h3>
                        <div className="sh-record-chips">
                          <span className="sh-chip sh-chip--date">
                            <FaCalendarAlt /> {formatDate(r.serviceDate)}
                          </span>
                          {r.mileage && (
                            <span className="sh-chip sh-chip--mileage">
                              <FaTachometerAlt /> {parseFloat(r.mileage).toLocaleString()} km
                            </span>
                          )}
                          {r.cost && (
                            <span className="sh-chip sh-chip--cost">
                              <FaDollarSign /> {formatCost(r.cost)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="sh-record-actions">
                        <button
                          className="sh-expand-btn"
                          onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                          aria-label="Toggle details"
                        >
                          {expandedId === r.id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <button
                          className="sh-delete-btn"
                          onClick={() => setDeleteId(r.id)}
                          aria-label="Delete record"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {expandedId === r.id && (
                      <div className="sh-record-detail">
                        {r.description && (
                          <p className="sh-detail-desc">{r.description}</p>
                        )}
                        {r.image && (
                          <div className="sh-detail-img-wrap">
                            <img src={r.image} alt="Service receipt" className="sh-detail-img" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div className="sh-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="sh-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete record?</h3>
            <p>This will permanently remove the service record. This cannot be undone.</p>
            <div className="sh-modal-actions">
              <button className="sh-modal-btn sh-modal-btn--cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="sh-modal-btn sh-modal-btn--confirm" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleServiceHistory;
