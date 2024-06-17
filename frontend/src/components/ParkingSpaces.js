// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ParkingArea from './ParkingArea';
// import { ItemTypes } from './ItemTypes';
// import axios from 'axios';
// import '../styles/ParkingSpaces.css';

// const ParkingSpaces = () => {
//   const [spaces, setSpaces] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { villaName, address } = location.state || {};

//   const addSpace = (type) => {
//     const id = spaces.length + 1;
//     setSpaces([...spaces, { id, type, left: 0, top: 0, width: 50, height: 50 }]);
//   };

//   const moveSpace = (id, left, top) => {
//     setSpaces((prevSpaces) =>
//       prevSpaces.map((space) =>
//         space.id === id ? { ...space, left, top } : space
//       )
//     );
//   };

//   const resizeSpace = (id, width, height) => {
//     setSpaces((prevSpaces) =>
//       prevSpaces.map((space) =>
//         space.id === id ? { ...space, width, height } : space
//       )
//     );
//   };

//   const deleteSpace = (id) => {
//     setSpaces((prevSpaces) =>
//       prevSpaces.filter((space) => space.id !== id)
//     );
//   };

//   const handleSave = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/villa/save', {
//         villaName,
//         address,
//         spaces,
//       });
//       if (response.status === 201) {
//         const { villaId, qrCode } = response.data;
//         navigate('/villa-qrcode', { state: { villaId, qrCode } });
//       }
//     } catch (error) {
//       console.error('Error saving villa:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>내 빌라 등록 - 주차 공간 생성</h2>
//       <div>
//         <label>Villa Name:</label>
//         <input type="text" value={villaName} readOnly />
//       </div>
//       <div>
//         <label>Address:</label>
//         <input type="text" value={address} readOnly />
//       </div>
//       <div className="toolbar">
//         <button onClick={() => addSpace(ItemTypes.VILLA)}>Add Villa</button>
//         <button onClick={() => addSpace(ItemTypes.PARKING)}>Add Parking</button>
//         <button onClick={() => addSpace(ItemTypes.EXIT)}>Add Exit</button>
//         <button onClick={() => addSpace(ItemTypes.WALL)}>Add Wall</button>
//       </div>
//       <ParkingArea spaces={spaces} moveSpace={moveSpace} resizeSpace={resizeSpace} deleteSpace={deleteSpace} />
//       <button type="button" onClick={handleSave}>Save</button>
//     </div>
//   );
// };

// export default ParkingSpaces;


import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ParkingArea from './ParkingArea';
import { ItemTypes } from './ItemTypes';
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
      const response = await axios.post('http://localhost:3001/api/villa/save', {
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
        <h2 className='parking-h2'>주차 공간 생성</h2>
      </div>
      <div className='parking-body'>
        <div className="input-group">
          <label>빌라 이름:</label>
          <input type="text" value={villaName} readOnly className="input-field"/>
        </div>
        <div className="input-group">
          <label>주소:</label>
          <input type="text" value={address} readOnly className="input-field"/>
        </div>
        <div className="toolbar">
          <button className="btn toolbar-btn" onClick={() => addSpace(ItemTypes.VILLA)}>Add Villa</button>
          <button className="btn toolbar-btn" onClick={() => addSpace(ItemTypes.PARKING)}>Add Parking</button>
          <button className="btn toolbar-btn" onClick={() => addSpace(ItemTypes.EXIT)}>Add Exit</button>
          <button className="btn toolbar-btn" onClick={() => addSpace(ItemTypes.WALL)}>Add Wall</button>
        </div>
        <ParkingArea spaces={spaces} moveSpace={moveSpace} resizeSpace={resizeSpace} deleteSpace={deleteSpace} />
        <button type="button" className="btn parkingsave-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default ParkingSpaces;
