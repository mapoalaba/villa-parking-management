const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user');
const villaRouter = require('./routes/villa');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 3 // 3분
    }
}));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

const userRouter = require('./routes/user');
app.use('/api/user', userRouter);
app.use('/api/villa', villaRouter);

app.use((req, res, next) => {
  if (req.session.user) {
    console.log(`Session exists: ${JSON.stringify(req.session)}`);
  } else {
    console.log('No active session');
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Villa Parking Management API');
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
    return res.json({ message: 'Admin login successful', token: 'dummy-token-for-testing', isAdmin: true });
  }

  // 일반 사용자 로그인 처리
  const user = await User.findOne({ username });
  if (!user) {
    console.log('아이디, 비밀번호를 입력하세요');
    return res.status(400).json({ message: '아이디, 비밀번호를 입력하세요' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log('아이디, 비밀번호를 입력하세요');
    return res.status(400).json({ message: '아이디, 비밀번호를 입력하세요' });
  }

  req.session.user = { id: user._id, username: user.username };
  console.log(`Session created: ${JSON.stringify(req.session)}`);
  res.json({ message: 'Login successful', token: 'dummy-token-for-testing' });
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

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get('/api/user/current', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(req.session.user);
});