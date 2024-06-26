const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();
const User = require('./models/User');
const userRouter = require('./routes/user');
const villaRouter = require('./routes/villa');
const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = ['https://localhost:3000', 'https://138.2.118.184:3000'];

app.use(cors({
  origin: function(origin, callback){
      // 허용된 출처가 없는 경우에도 허용 (개발 중에만 사용, 실제로는 필요에 따라 조정)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
      }
      return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: true, // HTTPS를 사용할 때는 true로 설정해야 합니다.
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30분
    }
}));

app.use('/api/user', userRouter);
app.use('/api/villa', villaRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Villa Parking Management API');
});

app.use((req, res, next) => {
  if (req.session.user) {
    console.log(`Session exists: ${JSON.stringify(req.session)}`);
  } else {
    console.log('No active session');
  }
  next();
});

app.post('/register', async (req, res) => {
  const { username, password, phone, address, vehicleNumber, vehicleName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, phone, address, vehicleNumber, vehicleName });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 관리자 계정인지 확인
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.user = { username, isAdmin: true };
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Error saving session' });
      }
      console.log(`Session created for admin: ${JSON.stringify(req.session)}`);
      res.json({ message: 'Admin login successful', token: 'dummy-token-for-testing', isAdmin: true });
    });
    return;
  }

  // 일반 사용자 로그인 처리
  const user = await User.findOne({ username });
  if (!user) {
    console.log('Invalid username or password');
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log('Invalid username or password');
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  req.session.user = { id: user._id, username: user.username };
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ message: 'Error saving session' });
    }
    console.log(`Session created: ${JSON.stringify(req.session)}`);
    res.json({ message: 'Login successful', token: 'dummy-token-for-testing' });
  });
});

app.post('/logout', (req, res) => {
  console.log(`Session before destroy: ${JSON.stringify(req.session)}`);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    console.log('Session destroyed');
    res.json({ message: 'Logout successful' });
  });
});

app.get('/api/user/current', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(req.session.user);
});

// 세션 확인 라우트 추가
app.get('/api/user/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ sessionActive: true, user: req.session.user });
  } else {
    res.json({ sessionActive: false });
  }
});

const authenticateToken = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = req.session.user;
  next();
};

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });

// SSL 옵션 설정
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.crt')),
};

// HTTPS 서버 시작
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS Express server is running on port: ${port}`);
});