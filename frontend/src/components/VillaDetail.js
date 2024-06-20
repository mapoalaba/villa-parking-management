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
    vehicleName: '',
    vehicleNumber: '',
    phone: '',
    exitTime: '',
    notes: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/current`, { withCredentials: true });
        setCurrentUser(response.data);
        console.log("Current User:", response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchVilla = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/villa/${id}`);
        setVilla(response.data);
        setSpaces(response.data.spaces || []);
        console.log("Villa ID:", id);
      } catch (error) {
        console.error('Error fetching villa details:', error);
      }
    };

    fetchVilla();
  }, [id]);

  const openModal = (space) => {
    console.log("Selected Space:", space);
    setSelectedSpace(space);
    if (space.isOccupied) {
      setForm({
        vehicleName: space.vehicleName || '',
        vehicleNumber: space.vehicleNumber || '',
        phone: space.phone || '',
        exitTime: space.exitTime ? new Date(space.exitTime).toISOString().slice(0, -1) : '',
        notes: space.notes || ''
      });
    } else {
      setForm({
        vehicleName: '',
        vehicleNumber: '',
        phone: '',
        exitTime: '',
        notes: ''
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSpace(null);
    setForm({
      vehicleName: '',
      vehicleNumber: '',
      phone: '',
      exitTime: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedSpace || !currentUser) return;

    const updatedSpace = {
      ...selectedSpace,
      ...form,
      isOccupied: !selectedSpace.isOccupied,
      userId: !selectedSpace.isOccupied ? currentUser.id : null
    };

    console.log("Updating space:", updatedSpace);
    console.log("Villa ID:", id);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/villa/${id}/update-space/${selectedSpace._id}`,
        updatedSpace,
        { withCredentials: true }
      );
      console.log("API Response:", response.data);
      setSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space._id === selectedSpace._id ? response.data.space : space
        )
      );
      setSelectedSpace(response.data.space); // 모달 창의 내용을 업데이트합니다.
      closeModal(); // 모달을 닫습니다.
    } catch (error) {
      console.error('Error updating parking space:', error);
    }
  };

  if (!villa) return <div>Loading...</div>;

  return (
    <div className="villa-detail-container">
      <h2>{villa.villaName}</h2>
      <p>{villa.address}</p>
      <div className="villa-spaces-container">
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
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedSpace && selectedSpace.isOccupied ? (
          <div className="modal-content">
            <p>차종: {selectedSpace.vehicleName}</p>
            <p>차번호: {selectedSpace.vehicleNumber}</p>
            <p>연락처: {selectedSpace.phone}</p>
            <p>출차시간: {selectedSpace.exitTime}</p>
            <p>특이사항: {selectedSpace.notes}</p>
            {currentUser && (selectedSpace.userId === currentUser.id || currentUser.isAdmin) && (
              <button className="modal-button" onClick={handleSubmit}>출차하기</button>
            )}
          </div>
        ) : (
          <div className="modal-content">
            <label>
              출차시간:
              <input
                type="datetime-local"
                name="exitTime"
                value={form.exitTime}
                onChange={handleInputChange}
              />
            </label>
            <label>
              특이사항:
              <textarea name="notes" value={form.notes} onChange={handleInputChange}></textarea>
            </label>
            <button className="modal-button" onClick={handleSubmit}>주차하기</button>
          </div>
        )}
        <button className="modal-close-button" onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default VillaDetail;