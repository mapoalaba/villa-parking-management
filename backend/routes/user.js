const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const twilio = require('twilio');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Twilio 설정을 환경 변수에서 가져옴
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log('Twilio Account SID:', accountSid);
console.log('Twilio Auth Token:', authToken);
console.log('Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);

// 로그인 라우트
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       const user = await User.findOne({ username });
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid username or password' });
//       }
  
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: 'Invalid username or password' });
//       }

//       req.session.user = {
//         id: user._id,
//         username: user.username,
//         role: user.role
//       };
  
//       res.status(200).json({ message: 'Login successful', token: 'dummy-token-for-testing' });
//     } catch (err) {
//       console.error('Error during login:', err);
//       res.status(500).json('Error: ' + err);
//     }
//   });
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    let isAdmin = false;

    if (!user && username === ADMIN_USERNAME) {
      const isMatch = password === ADMIN_PASSWORD;
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
      isAdmin = true;
      user = { _id: 'admin', username: ADMIN_USERNAME };
    } else if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      isAdmin: isAdmin
    };

    res.status(200).json({ message: 'Login successful', isAdmin: isAdmin, token: 'dummy-token-for-testing' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json('Error: ' + err);
  }
});

// 로그아웃 라우트
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

// 사용자명 중복 체크 라우트
router.post('/check-username', async (req, res) => {
    console.log('Check username route called');
    try {
        const user = await User.findOne({ username: req.body.username });
        res.json({ available: !user });
    } catch (err) {
        console.error('Error checking username:', err);
        res.status(500).json('Error: ' + err);
    }
});

// 회원가입 라우트
router.post('/register', async (req, res) => {
    console.log('Register route called');
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            phone: req.body.phone,
            address: req.body.address,
            vehicleNumber: req.body.vehicleNumber,
            vehicleName: req.body.vehicleName,
        });

        await newUser.save();
        res.status(201).json('User registered!');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json('Error: ' + err);
    }
});

// 핸드폰 인증 코드 전송 라우트
router.post('/send-code', async (req, res) => {
    const { phone } = req.body;
    const phoneNumber = parsePhoneNumberFromString(phone, 'KR'); // 한국 전화번호로 파싱
    if (!phoneNumber || !phoneNumber.isValid()) {
        console.error('Invalid phone number:', phone);
        return res.status(400).json('Invalid phone number');
    }

    const formattedPhone = phoneNumber.number; // 국제 형식으로 포맷
    console.log(`Formatted phone number: ${formattedPhone}`);

    const code = Math.floor(100000 + Math.random() * 900000); // 6자리 인증 코드 생성
    const expirationTime = Date.now() + 3 * 60 * 1000; // 3분 후 만료 시간 설정

    console.log(`Sending verification code ${code} to phone ${formattedPhone}`);
    
    try {
        const message = await client.messages.create({
            body: `Your verification code is ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER, // 환경 변수에서 Twilio 번호 가져옴
            to: formattedPhone
        });

        console.log('Twilio message response:', message);

        req.session.verificationCode = code; // 세션에 인증 코드 저장
        req.session.verificationCodeExpiration = expirationTime; // 세션에 만료 시간 저장
        console.log('Before saving session:', req.session); // 세션 저장 전 로그

        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json('Error saving session');
            }
            console.log('Stored verification code in session:', req.session.verificationCode);
            console.log('After saving session:', req.session); // 세션 저장 후 로그
            console.log('Verification code sent successfully');
            res.status(200).json('Verification code sent!');
        });
    } catch (err) {
        console.error('Error sending verification code:', err);
        res.status(500).json('Error: ' + err.message);
    }
});

// 핸드폰 인증 코드 검증 라우트
router.post('/verify-code', (req, res) => {
    const { code } = req.body;
    console.log(`Verifying code ${code}`);
    console.log('Stored verification code in session:', req.session.verificationCode);

    if (Date.now() > req.session.verificationCodeExpiration) {
        console.error('Verification code expired');
        return res.status(400).json('Verification code expired!');
    }

    if (parseInt(code) === req.session.verificationCode) {
        res.status(200).json('Phone number verified!');
    } else {
        console.error('Invalid verification code');
        res.status(400).json('Invalid verification code!');
    }
});

// 세션 확인 라우트
router.get('/check-session', (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        req.session.verificationCode = null;
        req.session.verificationCodeExpiration = null;

        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// 사용자 이름 봔환 라우트
router.post('/retrieve-username', async (req, res) => {
    const { phone } = req.body;
    try {
      const users = await User.find({ phone });
      if (users.length > 0) {
        const usernames = users.map(user => user.username);
        res.json({ usernames });
      } else {
        res.status(404).json({ message: 'No user found with this phone number' });
      }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving username', error });
    }
});

//비밀번호 변경 라우트
router.post('/change-password', async (req, res) => {
    const { phone, username, newPassword } = req.body;
    try {
      const user = await User.findOne({ phone, username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error });
    }
});

// 모든 사용자 목록을 가져오는 API
router.get('/all', async (req, res) => {
    try {
      const users = await User.find({}, 'username'); // 모든 사용자를 username 필드만 가져옴
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });
  
  // 사용자 삭제 API
  router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  });

module.exports = router;
