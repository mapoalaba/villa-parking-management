import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressInput = () => {
  const [form, setForm] = useState({
    villaName: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prevForm) => ({
          ...prevForm,
          address: data.address,
        }));
      },
    }).open();
  };

  const handleNext = () => {
    navigate('/register-villa/parking', { state: { ...form } });
  };

  return (
    <div>
      <h2>내 빌라 등록 - 주소 입력</h2>
      <div>
        <label>Villa Name:</label>
        <input 
          type="text" 
          name="villaName" 
          value={form.villaName} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div>
        <label>Address:</label>
        <input 
          type="text" 
          name="address" 
          value={form.address} 
          readOnly 
          required 
        />
        <button type="button" onClick={handleAddressSearch}>Search Address</button>
      </div>
      <button 
        type="button" 
        onClick={handleNext} 
        disabled={!form.villaName || !form.address}
      >
        Next
      </button>
    </div>
  );
};

export default AddressInput;
