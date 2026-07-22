import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaPlus, FaPen, FaCalendarAlt, FaClipboardList, FaCar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Garage.css";
import RedirectService from "./redirectService";

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [deleteId, setDeleteId] = useState(null);   // confirm before delete
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user?.nickname) {
      axios
        .get("/api/vehicles")
        .then((res) => {
          setVehicles(res.data.filter((v) => v.user === user.nickname));
        })
        .catch(() => setError("Failed to load vehicles. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [user, isAuthenticated]);

  const handleDelete = (id) => {
    axios
      .delete(`/api/vehicles/deleteVehicle/${id}`)
      .then(() => {
        toast.success("Vehicle removed from garage");
        setVehicles((prev) => prev.filter((v) => v._id !== id));
        setDeleteId(null);
      })
      .catch(() => toast.error("Failed to delete vehicle"));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="garage-page">

      {/* ── PAGE HEADER ── */}
      <div className="garage-header">
        <div className="garage-header-inner">
          <div>
            <span className="garage-eyebrow">My Vehicles</span>
            <h1 className="garage-title">My Garage</h1>
            <p className="garage-subtitle">
              {vehicles.length > 0
                ? `${vehicles.length} vehicle${vehicles.length > 1 ? "s" : ""} tracked`
                : "Add your first vehicle to get started"}
            </p>
          </div>
          <NavLink to="/addnew" className="btn-add-vehicle">
            <FaPlus /> Add Vehicle
          </NavLink>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="garage-body">

        {/* Loading */}
        {loading && (
          <div className="garage-loader">
            <div className="garage-spinner" />
            <p>Loading your garage…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="garage-empty">
            <FaCar className="garage-empty-icon" />
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="garage-empty">
            <FaCar className="garage-empty-icon" />
            <h3>Your garage is empty</h3>
            <p>Add your first vehicle to start tracking maintenance.</p>
            <NavLink to="/addnew" className="btn-add-vehicle">
              <FaPlus /> Add Your First Car
            </NavLink>
          </div>
        )}

        {/* Vehicle grid */}
        {!loading && !error && vehicles.length > 0 && (
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="vehicle-card">

                {/* Card image */}
                <div className="vehicle-img-wrap">
                  {vehicle.image
                    ? <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} />
                    : (
                      <div className="vehicle-img-placeholder">
                        <FaCar />
                      </div>
                    )
                  }
                  <span className="vehicle-year-badge">{vehicle.year}</span>
                </div>

                {/* Card body */}
                <div className="vehicle-body">
                  <div className="vehicle-body-top">
                    <div>
                      <h3 className="vehicle-name">{vehicle.make} {vehicle.model}</h3>
                      {vehicle.modification && (
                        <p className="vehicle-mod">{vehicle.modification}</p>
                      )}
                    </div>
                    <div className="vehicle-controls">
                      <NavLink to={`/update/${vehicle._id}`} className="ctrl-btn ctrl-btn--edit" aria-label="Edit vehicle">
                        <FaPen size={13} />
                      </NavLink>
                      <button
                        className="ctrl-btn ctrl-btn--delete"
                        aria-label="Delete vehicle"
                        onClick={() => setDeleteId(vehicle._id)}
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="vehicle-divider" />

                  <div className="vehicle-actions">
                    <NavLink to={`/maintenancetask/${vehicle._id}`} className="veh-btn veh-btn--primary">
                      <FaClipboardList /> Maintenance
                    </NavLink>
                    <NavLink to="/servicehistory" className="veh-btn veh-btn--secondary">
                      <FaClipboardList /> Service History
                    </NavLink>
                    <button className="veh-btn veh-btn--outline" onClick={() => RedirectService(vehicle.make)}>
                      <FaCalendarAlt /> Book Service
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new card */}
            <NavLink to="/addnew" className="vehicle-card vehicle-card--add">
              <div className="add-card-inner">
                <div className="add-card-icon"><FaPlus /></div>
                <p className="add-card-label">Add New Vehicle</p>
              </div>
            </NavLink>
          </div>
        )}
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Remove vehicle?</h3>
            <p>This will permanently delete the vehicle and all its data. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn--cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="modal-btn modal-btn--confirm" onClick={() => handleDelete(deleteId)}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Garage;
