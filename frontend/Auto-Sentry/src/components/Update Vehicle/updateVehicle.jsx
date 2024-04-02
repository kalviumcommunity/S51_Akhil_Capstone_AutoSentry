import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./updateVehicle.css";

const updateVehicle = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [make, setMake] = useState();
  const [model, setModel] = useState();
  const [year, setYear] = useState();
  const [modification, setModification] = useState();
  const [vin, setVin] = useState();
  const [image, setImage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
      axios.get('http://localhost:5000/api/vehicles/'+id)
      .then(result => {console.log(result)
        setUser(result.data.user)
        setMake(result.data.make)
        setModel(result.data.model)
        setYear(result.data.year)
        setModification(result.data.modification)
        setVin(result.data.vin)
        setImage(result.data.image)
    })
      .catch(error => console.log(error))
    }, []);
  
    const Update = (e) => {
        e.preventDefault();
        axios.put("http://localhost:5000/api/vehicles/updateVehicle/"+id,{user,make,model,year,modification,vin,image})
        .then(result => {
          console.log(result)
          navigate('/garage')
        })
        .catch(err => console.log(err))
    
      }

  return (
    <div className="form-container">
      <div className="form-content">
        <form onSubmit={Update} >
          <h2>Update Vehicle Details</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="user">
              User:
            </label>
            <input
              type="text"
              placeholder="Enter User Name"
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="make">
              Make:
            </label>
            <input
              type="text"
              placeholder="Enter Make"
              className="form-control"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="model">
              Model:
            </label>
            <input
              type="text"
              placeholder="Enter Model"
              className="form-control"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="year">
              Year:
            </label>
            <input
              type="number"
              placeholder="Enter the Year"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="modification">
              Modification:
            </label>
            <input
              type="text"
              placeholder="Enter the Modification"
              className="form-control"
              value={modification}
              onChange={(e) => setModification(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="vin">
              VIN:
            </label>
            <input
              type="number"
              placeholder="Enter the VIN"
              className="form-control"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="image">
              Image URL:
            </label>
            <input
              type="text"
              placeholder="Paste the Vehicle Image URL"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <button className="btn-submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default updateVehicle;
