import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import '../styles/VillaDetail.css';

Modal.setAppElement('#root');

const VillaDetail = () => {
  const { id } = useParams();
  const [villa, setVilla] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [form, setForm] = useState({
    carType: '',
    carNumber: '',
    contact: '',
    exitTime: '',
    notes: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/current', { withCredentials: true });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/villa/${id}`);
        setVilla(response.data);
        setSpaces(response.data.spaces || []);
      } catch (error) {
        console.error('Error fetching villa details:', error);
      }
    };

    fetchVilla();
  }, [id]);

  const openModal = (space) => {
    setSelectedSpace(space);
    setModalIsOpen(true);
    if (space.isOccupied) {
      setForm({
        carType: space.carType || '',
        carNumber: space.carNumber || '',
        contact: space.contact || '',
        exitTime: space.exitTime || '',
        notes: space.notes || ''
      });
    } else {
      setForm({
        carType: '',
        carNumber: '',
        contact: '',
        exitTime: '',
        notes: ''
      });
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSpace(null);
    setForm({
      carType: '',
      carNumber: '',
      contact: '',
      exitTime: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedSpace) return;

    const updatedSpace = {
      ...selectedSpace,
      ...form,
      isOccupied: !selectedSpace.isOccupied,
      userId: selectedSpace.isOccupied ? null : currentUser.id
    };

    console.log(`Updating space with villaId: ${id} and spaceId: ${selectedSpace._id}`);
    console.log('Updated space data:', updatedSpace);

    try {
      await axios.post(
        `http://localhost:3001/api/villa/${id}/update-space/${selectedSpace._id}`,
        updatedSpace,
        { withCredentials: true }
      );
      setSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space._id === selectedSpace._id ? updatedSpace : space
        )
      );
      closeModal();
    } catch (error) {
      console.error('Error updating parking space:', error);
    }
  };

  if (!villa) return <div>Loading...</div>;

  return (
    <div>
      <h2>{villa.villaName}</h2>
      <p>{villa.address}</p>
      <div style={{ position: 'relative', width: '100%', height: '500px', border: '1px solid black' }}>
        {spaces.map((space) => (
          <div
            key={space._id}
            onClick={() => {
              if (space.type === 'PARKING') {
                openModal(space);
              }
            }}
            className={`space ${space.isOccupied ? 'occupied' : 'available'}`}
            style={{
              left: space.left,
              top: space.top,
              width: space.width,
              height: space.height
            }}
          >
            {space.type}
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Space Details"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '50%'
          }
        }}
      >
        <h2>Space Details</h2>
        {selectedSpace && selectedSpace.isOccupied ? (
          <div>
            <p>차종: {selectedSpace.carType}</p>
            <p>차번호: {selectedSpace.carNumber}</p>
            <p>연락처: {selectedSpace.contact}</p>
            <p>출차시간: {selectedSpace.exitTime}</p>
            <p>특이사항: {selectedSpace.notes}</p>
            {currentUser && selectedSpace.userId === currentUser.id && (
              <button onClick={handleSubmit}>출차하기</button>
            )}
          </div>
        ) : (
          <div>
            <label>
              출차시간:
              <input type="text" name="exitTime" value={form.exitTime} onChange={handleInputChange} />
            </label>
            <label>
              특이사항:
              <textarea name="notes" value={form.notes} onChange={handleInputChange}></textarea>
            </label>
            <button onClick={handleSubmit}>주차하기</button>
          </div>
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default VillaDetail;