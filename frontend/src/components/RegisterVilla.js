import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddressInput from './AddressInput';
import ParkingSpaces from './ParkingSpaces';
import axios from 'axios';

const RegisterVilla = () => {
  const [villaName, setVillaName] = useState('');
  const [address, setAddress] = useState('');
  const [spaces, setSpaces] = useState([]);
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/villa/save', { villaName, address, spaces }, { withCredentials: true });
      if (response && response.data) {
        navigate('/villa-qrcode', { state: { villaId: response.data.villaId, qrCode: response.data.qrCode } });
      }
    } catch (error) {
      console.error('Error saving villa:', error);
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<AddressInput address={address} setAddress={setAddress} setVillaName={setVillaName} />} 
      />
      <Route 
        path="parking" 
        element={
          <ParkingSpaces 
            spaces={spaces} 
            setSpaces={setSpaces} 
            handleSave={handleSave} 
          />
        } 
      />
    </Routes>
  );
};

export default RegisterVilla;
