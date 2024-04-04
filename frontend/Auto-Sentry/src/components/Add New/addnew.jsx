import React, { useState } from 'react';
import './addnew.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import {storage} from "../../firebase"
import {ref,uploadBytes} from "firebase/storage"
import {v4} from "uuid";
 
const AddNew = () => {
  const { user } = useAuth0();
  const [username, setUsername] = useState(user.nickname);
  const [make, setMake] = useState()
  const [model, setModel] = useState()
  const [year, setYear] = useState()
  const [modification, setModification] = useState()
  const [vin, setVin] = useState()
  const [image, setImage] = useState()
  const navigate = useNavigate()

  console.log("Current User's Nickname", user.nickname);
  
  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/vehicles",{user: username,make,model,year,modification,vin,image})
    .then(result => {
      console.log(result)
      toast.success("Vehicle Created Successfully");
      setTimeout(() => {
        navigate("/garage");
      }, 1000);
    })
    .catch(err => console.log(err))
  }

  const uploadImage = () =>{
    if(image == null) return;
    const imageRef = ref(storage, `vehicleimages/${image.name + v4() }`);
    uploadBytes(imageRef, image).then(()=>{
      alert("Image uploaded")
    })
  }
  
  return (

    <div className='form-container'> 
    <ToastContainer />
      <div className='form-content'>
        <form onSubmit={Submit}>
          <h2>Add Vehicle</h2>
          {/* <div className='form-group'>
            <label className='form-label' htmlFor='username'>Username:</label>
            <input type='text'placeholder='Enter Username'className='form-control'value={username}
              onChange={(e) => setUsername(e.target.value)}/>
          </div> */}
          <div className='form-group'>
            <label className='form-label' htmlFor='make'>Make:</label>
            <input type='text' placeholder='Enter Make' className='form-control'
            onChange={(e) => setMake(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='model'>Model:</label>
            <input type='text' placeholder='Enter Model' className='form-control'
            onChange={(e) => setModel(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='year'>Year:</label>
            <input type='number' placeholder='Enter the Year' className='form-control'
            onChange={(e) => setYear(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='modification'>Modification:</label>
            <input type='text' placeholder='Enter the Modification' className='form-control'
            onChange={(e) => setModification(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='vin'>VIN:</label>
            <input type='number' placeholder='Enter the VIN' className='form-control'
            onChange={(e) => setVin(e.target.value)}/>
          </div>
          <div className='form-group'>
            <label className='form-label' htmlFor='image'>Image URL:</label>
            <input type='file' placeholder='Paste the Vehicle Image URL' className='form-control'
            onChange={(e) => setImage(e.target.files[0])}/>
          </div>
          <button className='btn-submit' onClick={uploadImage}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddNew;
