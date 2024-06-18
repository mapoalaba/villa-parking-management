import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddressInput.css';

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
    <div className="address-input-container">
      <h2 className='address-header'>내 빌라 등록</h2>
      <div className="input-group">
        <label>빌라 이름:</label>
        <input 
          type="text" 
          name="villaName" 
          value={form.villaName} 
          onChange={handleChange} 
          className="input-field"
          required 
        />
      </div>
      <div className="input-group">
        <label>주소:</label>
        <div className="input-with-button">
          <input 
            type="text" 
            name="address" 
            value={form.address} 
            readOnly 
            className="addressinput-field"
            required 
          />
          <button 
            type="button" 
            onClick={handleAddressSearch} 
            className="addsearch-btn"
          >
            검색
          </button>
        </div>
      </div>
      <div className="addressinputbutton-group">
        <button 
          type="button" 
          onClick={handleNext} 
          className="addnext-btn"
          disabled={!form.villaName || !form.address}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AddressInput;