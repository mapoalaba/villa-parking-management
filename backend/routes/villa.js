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

// 특정 주차 공간 정보 조회 API
router.get('/parking/:spaceId', async (req, res) => {
  try {
    const villa = await Villa.findOne({ 'spaces.id': req.params.spaceId }, { 'spaces.$': 1 });
    if (villa) {
      res.json(villa.spaces[0]);
    } else {
      res.status(404).json({ message: 'Parking space not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// 빌라 주차 공간의 차량 정보 가져오기 API
router.get('/:id/parking/:spaceId', async (req, res) => {
  const villaId = req.params.id;
  const spaceId = req.params.spaceId;

  try {
    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    const space = villa.spaces.id(spaceId);
    if (!space) {
      return res.status(404).json({ message: 'Parking space not found' });
    }

    res.status(200).json(space);
  } catch (error) {
    console.error('Error fetching parking space details:', error);
    res.status(500).json({ message: 'Error fetching parking space details', error });
  }
});

// 주차 공간 세부 정보 API
router.get('/:villaId/parking/:spaceId', async (req, res) => {
  const { villaId, spaceId } = req.params;

  try {
    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    const space = villa.spaces.id(spaceId);
    if (!space) {
      return res.status(404).json({ message: 'Parking space not found' });
    }

    res.status(200).json(space);
  } catch (error) {
    console.error('Error fetching parking space details:', error);
    res.status(500).json({ message: 'Error fetching parking space details', error });
  }
});

// 빌라 업데이트 API
router.post('/update/:id', async (req, res) => {
  const villaId = req.params.id;
  const { spaces } = req.body;

  try {
    const villa = await Villa.findByIdAndUpdate(villaId, { spaces }, { new: true });
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }
    res.status(200).json(villa);
  } catch (error) {
    res.status(500).json({ message: 'Error updating villa', error });
  }
});

// 주차 공간 업데이트 API
router.post('/:villaId/update-space/:spaceId', async (req, res) => {
  const { villaId, spaceId } = req.params;
  const { exitTime, notes, isOccupied, userId } = req.body;

  try {
    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    const space = villa.spaces.id(spaceId);
    if (!space) {
      return res.status(404).json({ message: 'Parking space not found' });
    }

    if (isOccupied) {
      space.isOccupied = isOccupied;
      space.exitTime = exitTime;
      space.notes = notes;
      space.userId = userId;
    } else {
      space.isOccupied = isOccupied;
      space.exitTime = null;
      space.notes = null;
      space.userId = null;
    }

    await villa.save();
    res.status(200).json({ message: 'Parking space updated successfully' });
  } catch (error) {
    console.error('Error updating parking space:', error);
    res.status(500).json({ message: 'Error updating parking space', error });
  }
});

// 사용자 정보 API
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
});

module.exports = router;