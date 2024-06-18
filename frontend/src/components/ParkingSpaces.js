import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ParkingArea from './ParkingArea';
import { ItemTypes } from './ItemTypes'; // ItemTypes 가져오기
import axios from 'axios';
import '../styles/ParkingSpaces.css';

const ParkingSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { villaName, address } = location.state || {};

  const addSpace = (type) => {
    const id = spaces.length + 1;
    setSpaces([...spaces, { id, type, left: 0, top: 0, width: 50, height: 50 }]);
  };

  const moveSpace = (id, left, top) => {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) =>
        space.id === id ? { ...space, left, top } : space
      )
    );
  };

  const resizeSpace = (id, width, height) => {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) =>
        space.id === id ? { ...space, width, height } : space
      )
    );
  };

  const deleteSpace = (id) => {
    setSpaces((prevSpaces) =>
      prevSpaces.filter((space) => space.id !== id)
    );
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/villa/save`, {
        villaName,
        address,
        spaces,
      });
      if (response.status === 201) {
        const { villaId, qrCode } = response.data;
        navigate('/villa-qrcode', { state: { villaId, qrCode } });
      }
    } catch (error) {
      console.error('Error saving villa:', error);
    }
  };

  return (
    <div className="parking-container">
      <div className='parking-header'>
        <h2> 주차 공간 생성 </h2>
      </div>
      <div className='parking-body'>
        <div className="input-group">
          <label> 빌라 이름 : </label>
          <input type="text" value={villaName} readOnly className="input-field"/>
        </div>
        <div className="input-group">
          <label> 주소 : </label>
          <input type="text" value={address} readOnly className="input-field"/>
        </div>
        <div className="toolbar">
          <button className="toolbar-btn" onClick={() => addSpace(ItemTypes.VILLA)}> 빌라 </button>
          <button className="toolbar-btn" onClick={() => addSpace(ItemTypes.PARKING)}> 주차칸 </button>
          <button className="toolbar-btn" onClick={() => addSpace(ItemTypes.EXIT)}> 출구 </button>
          <button className="toolbar-btn" onClick={() => addSpace(ItemTypes.WALL)}> 벽 </button>
        </div>
        <ParkingArea spaces={spaces} setSpaces={setSpaces} moveSpace={moveSpace} resizeSpace={resizeSpace} deleteSpace={deleteSpace} />
        <button type="button" className="parkingsave-btn" onClick={handleSave}> 저장 </button>
      </div>
    </div>
  );
};

export default ParkingSpaces;