import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, isOccupied, onSave }) => {
  const [departureTime, setDepartureTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const details = {
      carType,
      carNumber,
      contact,
      departureTime,
      notes
    };
    onSave(details);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {isOccupied ? (
          <>
            <h2>주차 정보</h2>
            <div>차종: {carType}</div>
            <div>차번호: {carNumber}</div>
            <div>연락처: {contact}</div>
            <div>출차시간: {departureTime}</div>
            <div>특이사항: {notes}</div>
          </>
        ) : (
          <>
            <h2>주차하기</h2>
            <input type="text" placeholder="출차시간" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
            <input type="text" placeholder="특이사항" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button onClick={handleSave}>주차하기</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;