import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useAuth0 } from '@auth0/auth0-react';
import './Garage.css'; 

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);

  const { user } = useAuth0();

  console.log("Current User's Nickname", user.nickname);

  useEffect(() => {
    if(user && user.nickname) {
      axios.get('http://localhost:5000/api/vehicles')
        .then(response => {
          const userVehicles = response.data.filter(vehicle => vehicle.user === user.nickname);
          setVehicles(userVehicles); 
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  const handleDelete = (id) =>{
    axios.delete('http://localhost:5000/api/vehicles/deleteVehicle/'+id)
    .then(res => {console.log(res)
      // window.location.reload()
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="garage-container">
      <h1>My Garage</h1>
      <div className="vehicle-list">
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className="vehicle-card">
            <img src={vehicle.image} alt="Vehicle" />
            <div className="vehicle-details">
              <h3>{vehicle.make} {vehicle.model}</h3>
              <p>Year: {vehicle.year}</p>
              <p>Modification: {vehicle.modification}</p>
              <NavLink to={`/update/${vehicle._id}`} className="update" activeClassName="active">
                <FaPen />
              </NavLink>
              <a className='btn-danger' onClick={(e)=>handleDelete(vehicle._id)}><MdDelete /></a>
            </div>
          </div>
        ))}
        <NavLink to="/addnew" className="addnew" activeClassName="active">
            <FaPlus />
            <h2>Add New Car</h2>
        </NavLink>
      </div>
    </div>
  );
};

export default Garage;
