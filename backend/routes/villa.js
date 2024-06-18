const express = require('express');
const router = express.Router();
const Villa = require('../models/Villa');
const QRCode = require('qrcode');
const User = require('../models/User');

// 빌라 저장 API
router.post('/save', async (req, res) => {
  const { villaName, address, spaces } = req.body;
  const users = req.session.user.id; // 로그인한 사용자의 ID 가져오기

  // 고유한 villaId 생성
  const generateUniqueId = () => {
    return 'villa_' + Math.random().toString(36).substr(2, 9);
  };

  let villaId = generateUniqueId();

  // 중복되지 않는 villaId 생성
  let villaExists = await Villa.findOne({ villaId });
  while (villaExists) {
    villaId = generateUniqueId();
    villaExists = await Villa.findOne({ villaId });
  }

  const villa = new Villa({ villaName, address, spaces, users: [users], villaId });

  try {
    const savedVilla = await villa.save();
    const qrCodeUrl = `${savedVilla._id}`;
    const qrCode = await QRCode.toDataURL(qrCodeUrl);
    res.status(201).json({ villaId: savedVilla.villaId, qrCode });
  } catch (error) {
    console.error('Error saving villa:', error);
    res.status(500).json({ message: 'Error saving villa', error });
  }
});

// 사용자 빌라 목록 API
router.get('/user-villas', async (req, res) => {
  const users = req.session.user.id; // 로그인한 사용자의 ID 가져오기
  console.log('Fetching villas for user:', users);

  try {
    const villas = await Villa.find({ users: users });
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
  console.log(`Received request for villaId: ${villaId}`);

  try {
    const villa = await Villa.findById(villaId);
    if (!villa) {
      console.log('Villa not found');
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
    const villa = await Villa.findOne({ 'spaces._id': req.params.spaceId }, { 'spaces.$': 1 });
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
// router.delete('/delete/:id', async (req, res) => {
//   const villaId = req.params.id;
//   const users = req.session.user.id; // 로그인한 사용자의 ID 가져오기

//   console.log(`Attempting to delete villa with ID ${villaId} for user ${users}`);

//   try {
//     const villa = await Villa.findOneAndDelete({ _id: villaId, users: users });
//     if (!villa) {
//       console.log('Villa not found or not authorized');
//       return res.status(404).json({ message: 'Villa not found or not authorized' });
//     }
//     console.log('Villa deleted successfully');
//     res.status(200).json({ message: 'Villa deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting villa:', error);
//     res.status(500).json({ message: 'Error deleting villa', error });
//   }
// });

// 빌라 추가 API
router.post('/add-villa', async (req, res) => {
  const { villaId } = req.body;
  const users = req.session.user.id; // 로그인한 사용자의 ID 가져오기

  try {
    const villa = await Villa.findOne({ _id: villaId });
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    // 사용자 ID를 추가하여 빌라를 업데이트
    if (!villa.users.includes(users)) {
      villa.users.push(users);
      await villa.save();
    }

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

  console.log(`Updating space with villaId: ${villaId} and spaceId: ${spaceId}`);

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
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      space.isOccupied = isOccupied;
      space.exitTime = exitTime;
      space.notes = notes;
      space.useId = userId;
      space.vehicleName = user.vehicleName;
      space.vehicleNumber = user.vehicleNumber;
      space.contact = user.phone;
    } else {
      space.isOccupied = isOccupied;
      space.exitTime = null;
      space.notes = null;
      space.userId = null;
      space.vehicleName = '';
      space.vehicleNumber = '';
      space.contact = '';
    }

    await villa.save();
    res.status(200).json({ message: 'Parking space updated successfully', space });
  } catch (error) {
    console.error('Error updating parking space:', error);
    res.status(500).json({ message: 'Error updating parking space', error });
  }
});

// 빌라 삭제 또는 목록에서 제거 API
router.delete('/remove-villa/:id', async (req, res) => {
  const villaId = req.params.id;
  const users = req.session.user.id;

  try {
    const villa = await Villa.findOne({ _id: villaId });
    if (!villa) {
      return res.status(404).json({ message: 'Villa not found' });
    }

    // 빌라를 만든 사용자인 경우 빌라 삭제
    if (villa.users[0].toString() === users) {
      await Villa.deleteOne({ _id: villaId });
      return res.status(200).json({ message: 'Villa deleted successfully' });
    }

    // 빌라 목록에서만 제거
    const updatedUsers = villa.users.filter(user => user.toString() !== users);
    villa.users = updatedUsers;

    await villa.save();
    res.status(200).json({ message: 'Villa removed from user list successfully' });
  } catch (error) {
    console.error('Error removing villa:', error);
    res.status(500).json({ message: 'Error removing villa', error });
  }
});

// 관리자 페이지 모든 빌라 목록 가져오기

// 모든 빌라와 관련된 회원 정보를 가져오는 API
router.get('/all', async (req, res) => {
  try {
    const villas = await Villa.find().populate('residents'); // residents 필드를 populate해서 관련된 회원 정보를 가져옴
    res.status(200).json(villas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching villas', error });
  }
});


router.delete('/delete/:id', async (req, res) => {
  const villaId = req.params.id;
  const users = req.session.user ? req.session.user.id : null; // 로그인한 사용자의 ID 가져오기

  console.log(`Attempting to delete villa with ID ${villaId} for user ${users}`);

  if (!users) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const villa = await Villa.findById(villaId).populate('residents'); // residents 필드를 populate해서 관련된 회원 정보를 가져옴
    if (!villa) {
      console.log('Villa not found or not authorized');
      return res.status(404).json({ message: 'Villa not found or not authorized' });
    }
    // 사용자 ID가 일치하는지 확인 후 삭제
    if (villa.users.toString() !== users.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this villa' });
    }

    await villa.remove();
    console.log('Villa deleted successfully');
    res.status(200).json({ message: 'Villa deleted successfully' });
  } catch (error) {
    console.error('Error deleting villa:', error);
    res.status(500).json({ message: 'Error deleting villa', error });
  }
});

module.exports = router;