const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const twilio = require('twilio');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Twilio 설정을 환경 변수에서 가져옴
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log('Twilio Account SID:', accountSid);
console.log('Twilio Auth Token:', authToken);
console.log('Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);

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

module.exports = router;