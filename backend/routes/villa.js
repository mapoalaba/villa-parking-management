const express = require('express');
const router = express.Router();
const Villa = require('../models/Villa'); // Villa 모델 가져오기
const QRCode = require('qrcode');

// 빌라 저장 API
router.post('/save', async (req, res) => {
  const { villaName, address, spaces } = req.body;
  const userId = req.session.user.id; // 로그인한 사용자의 ID 가져오기
  const villa = new Villa({ villaName, address, spaces, userId });

  try {
    const savedVilla = await villa.save();
    const villaId = savedVilla._id.toString();

    // QR 코드 생성
    const qrCode = await QRCode.toDataURL(`http://localhost:3000/villa/${villaId}`);
    
    res.status(201).json({ villaId, qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Error saving villa', error });
  }
});

// 사용자 빌라 목록 API
router.get('/user-villas', async (req, res) => {
  const userId = req.session.user.id; // 로그인한 사용자의 ID 가져오기
  console.log('Fetching villas for user:', userId);

  try {
    const villas = await Villa.find({ userId });
    console.log('Fetched villas:', villas);
    res.status(200).json(villas);
  } catch (error) {
    console.error('Error fetching villas:', error);
    res.status(500).json({ message: 'Error fetching villas', error });
  }
});

// 빌라 상세 정보 API
router.get('/:id', async (req, res) => {
  const villaId = req.params.id;

  try {
    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }
    res.status(200).json(villa);
  } catch (error) {
    console.error('Error fetching villa details:', error);
    res.status(500).json({ message: 'Error fetching villa details', error });
  }
});

// 빌라 삭제 API
router.delete('/delete/:id', async (req, res) => {
  const villaId = req.params.id;
  const userId = req.session.user.id; // 로그인한 사용자의 ID 가져오기

  console.log(`Attempting to delete villa with ID ${villaId} for user ${userId}`);

  try {
    const villa = await Villa.findOneAndDelete({ _id: villaId, userId });
    if (!villa) {
      console.log('Villa not found or not authorized');
      return res.status(404).json({ message: 'Villa not found or not authorized' });
    }
    console.log('Villa deleted successfully');
    res.status(200).json({ message: 'Villa deleted successfully' });
  } catch (error) {
    console.error('Error deleting villa:', error);
    res.status(500).json({ message: 'Error deleting villa', error });
  }
});

// 빌라 추가 API
router.post('/add-villa', async (req, res) => {
  const { villaId } = req.body;
  const userId = req.session.user.id; // 로그인한 사용자의 ID 가져오기

  try {
    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    // 사용자 ID를 추가하여 빌라를 업데이트
    villa.userId = userId;
    await villa.save();

    res.status(200).json({ message: 'Villa added successfully' });
  } catch (error) {
    console.error('Error adding villa:', error);
    res.status(500).json({ message: 'Error adding villa', error });
  }
});

module.exports = router;
