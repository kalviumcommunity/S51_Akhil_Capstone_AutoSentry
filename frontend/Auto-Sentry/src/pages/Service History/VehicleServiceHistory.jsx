import React, { useState, useEffect } from 'react';
import './VehicleServiceHistory.css';
import { imgDB, txtDB } from "./Historyconfig";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs } from "firebase/firestore";

const VehicleServiceHistory = () => {
  const [formData, setFormData] = useState({
    service: '',
    serviceDate: '',
    mileage: '',
    cost: '',
    description: '',
    image: ''
  });
  const [data, setData] = useState([]);

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
      service,
      serviceDate,
      mileage,
      cost,
      description,
      image
    });
    alert("Data added successfully");
  };

  const getData = async () =>{
    const dataRef = collection(txtDB,'txtData')
    const querySnapshot = await getDocs(dataRef)
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setData(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <input 
        type="text" 
        name="service" 
        value={formData.service} 
        onChange={handleChange} 
        placeholder="Service" 
      /><br />
      <input 
        type="date" 
        name="serviceDate" 
        value={formData.serviceDate} 
        onChange={handleChange} 
        placeholder="Service Date" 
      /><br />
      <input 
        type="text" 
        name="mileage" 
        value={formData.mileage} 
        onChange={handleChange} 
        placeholder="Mileage" 
      /><br />
      <input 
        type="text" 
        name="cost" 
        value={formData.cost} 
        onChange={handleChange} 
        placeholder="Cost" 
      /><br />
      <input 
        type="text" 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        placeholder="Description" 
      /><br />
      <input 
        type="file" 
        onChange={handleUpload} 
      /><br /><br />
      <button onClick={handleClick}>Add</button>

      {data.map(value => (
        <div key={value.id}>
          <h1>{value.service}</h1>
          <p>Service Date: {value.serviceDate}</p>
          <p>Mileage: {value.mileage}</p>
          <p>Cost: {value.cost}</p>
          <p>Description: {value.description}</p>
          <img src={value.image} height='200px' width='200px' alt='' />
        </div>
      ))}
    </div>
  );
};

export default VehicleServiceHistory;
