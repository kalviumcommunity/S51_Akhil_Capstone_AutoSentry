import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaPlus, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Garage.css";
import RedirectService from "./redirectService";

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user && user.nickname) {
      axios
        .get("http://localhost:5000/api/vehicles")
        .then((response) => {
          const userVehicles = response.data.filter(
            (vehicle) => vehicle.user === user.nickname
          );
          setVehicles(userVehicles);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, isAuthenticated]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/vehicles/deleteVehicle/${id}`)
      .then((res) => {
        console.log(res);
        toast.success("Vehicle Deleted Successfully");
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle._id !== id)
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    isAuthenticated && (
      <div className="garage-container">
        <h1>My Garage</h1>
        <ToastContainer />
        {loading ? ( 
          <div className="loader">
            <svg className="car" width="102" height="40" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(2 1)" stroke="#002742" fill="none" fill-rule="cd  back  evenodd" stroke-linecap="round" stroke-linejoin="round">
                <path className="car__body" d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01" stroke-width="3"/>
                <ellipse className="car__wheel--left" stroke-width="3.2" fill="#FFF" cx="83.493" cy="30.25" rx="6.922" ry="6.808"/>
                <ellipse className="car__wheel--right" stroke-width="3.2" fill="#FFF" cx="46.511" cy="30.25" rx="6.922" ry="6.808"/>
                <path className="car__line car__line--top" d="M22.5 16.5H2.475" stroke-width="3"/>
                <path className="car__line car__line--middle" d="M20.5 23.5H.4755" stroke-width="3"/>
                <path className="car__line car__line--bottom" d="M25.5 9.5h-19" stroke-width="3"/>
              </g>
            </svg>
          </div>
        ) : (
          <div className="vehicle-list">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="vehicle-card" >
                <img src={vehicle.image} alt="Vehicle" />
                <div className="vehicle-details">
                  <h3>
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p>Year: {vehicle.year}</p>
                  <p>Modification: {vehicle.modification}</p>
                  <div className="control-btns">
                    <NavLink
                      to={`/update/${vehicle._id}`}
                      className="update"
                      activeClassName="active"
                    >
                      <FaPen size={17}/>
                    </NavLink>
                    <a
                      className="btn-danger"
                      onClick={(e) => handleDelete(vehicle._id)}
                    >
                      <MdDelete size={18} />
                    </a>
                  </div>
                  <div className="activ-btns">
                    <NavLink to={`/maintenancetask/${vehicle._id}`}>
                      <button className="btn-mt">Maintenance tasks</button>
                    </NavLink>
                    <NavLink to={`/servicehistory`}>
                      <button className="btn-mt">Service History</button>
                    </NavLink>
                    <button
                      className="btn-mt"
                      onClick={() => RedirectService(vehicle.make)}
                    >
                      Book Service
                    </button>
                    <NavLink to={`/servicehistory`}>
                      <button className="btn-mt">Empty</button>
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
            <NavLink to="/addnew" className="addnew" activeClassName="active">
              <FaPlus />
              <h2>Add New Car</h2>
            </NavLink>
          </div>
        )}
        <ToastContainer />
      </div>
    )
  );
};

export default Garage;
