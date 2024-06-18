import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddressInput from './AddressInput';
import ParkingSpaces from './ParkingSpaces';
import axios from 'axios';

const RegisterVilla = () => {
  const [villaName, setVillaName] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSave = async (spaces) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/villa/save`, { villaName, address, spaces }, { withCredentials: true });
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
            villaName={villaName} 
            address={address} 
            handleSave={handleSave} 
          />
        } 
      />
    </Routes>
  );
};

export default RegisterVilla;