import React, { useState, useEffect } from 'react';
import './VehicleServiceHistory.css';
import { imgDB, txtDB } from "./Historyconfig";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VehicleServiceHistory = () => {
  const { user, isAuthenticated } = useAuth0();
  const [currentUser, setCurrentUser] = useState('');
  const [formData, setFormData] = useState({
    service: '',
    serviceDate: '',
    mileage: '',
    cost: '',
    description: '',
    image: ''
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentUser(user.nickname);
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const imageRef = ref(imgDB, `Imgs/${v4()}`);
    uploadBytes(imageRef, file).then(snapshot => {
      getDownloadURL(snapshot.ref).then(url => {
        setFormData({
          ...formData,
          image: url
        });
      });
    });
  };

  const handleClick = async () => {
    const { service, serviceDate, mileage, cost, description, image } = formData;
    const dataRef = collection(txtDB, 'txtData');
    await addDoc(dataRef, {
      user: currentUser,
      service,
      serviceDate,
      mileage,
      cost,
      description,
      image
    });
    location.reload();
    toast.success("Data added successfully");
  };

  const getData = async () =>{
    const dataRef = collection(txtDB,'txtData');
    const q = query(dataRef, where("user", "==", currentUser));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setData(data);
  }

  useEffect(() => {
    if (currentUser) {
      getData();
    }
  }, [currentUser]);

  const handleUserChange = (e) => {
    setCurrentUser(e.target.value);
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vehicle-service-history-container">
      <h1 className="title">Vehicle Service History</h1>
      <h3>Add New Entry</h3>
      <div>
        {/* <label htmlFor="user">User:</label>
        <input 
          type="text" 
          id="user" 
          value={currentUser} 
          onChange={handleUserChange} 
        /> */}
      </div>
      <br/>
      <div className="form-container">
        <div className="form">
          <div className="form-group">
            <label htmlFor="service">Service:</label>
            <input 
              type="text" 
              name="service" 
              id="service"
              value={formData.service} 
              onChange={handleChange} 
              placeholder="Service" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="serviceDate">Service Date:</label>
            <input 
              type="date" 
              name="serviceDate" 
              id="serviceDate"
              value={formData.serviceDate} 
              onChange={handleChange} 
              placeholder="Service Date" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="mileage">Mileage:</label>
            <input 
              type="text" 
              name="mileage" 
              id="mileage"
              value={formData.mileage} 
              onChange={handleChange} 
              placeholder="Mileage" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="cost">Cost:</label>
            <input 
              type="text" 
              name="cost" 
              id="cost"
              value={formData.cost} 
              onChange={handleChange} 
              placeholder="Cost" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              name="description" 
              id="description"
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Description" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload Image:</label>
            <input 
              type="file" 
              id="image"
              onChange={handleUpload} 
            />
          </div>
          <div className="form-group">
            <button onClick={handleClick}>Add</button>
          </div>
        </div>
      </div>

      <div className="history-container">
        <h3>Your Service History</h3>
        {data.map(value => (
          <div key={value.id} className="service-item">
            <h2>{value.service}</h2>
            <p><strong>Service Date:</strong> {value.serviceDate}</p>
            <p><strong>Mileage:</strong> {value.mileage}</p>
            <p><strong>Cost:</strong> {value.cost}</p>
            <p><strong>Description:</strong> {value.description}</p>
            <img src={value.image} alt='Service' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleServiceHistory;
