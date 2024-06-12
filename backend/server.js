const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user'); // User 모델 가져오기

const app = express();
const port = process.env.PORT || 3001;

// CORS 설정에서 credentials 옵션 추가
app.use(cors({
    origin: 'http://localhost:3000', // 클라이언트 주소
    credentials: true // 자격 증명 포함
}));

app.use(express.json());

// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET, // 환경 변수에서 비밀 키를 가져옴
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false, // 개발 중에는 false, 프로덕션에서는 true
        httpOnly: true,
        maxAge: 1000 * 60 * 3 // 3분
    }
}));

// MongoDB 연결 설정
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

// 사용자 라우터 설정
const userRouter = require('./routes/user');
app.use('/api/user', userRouter);

// 기본 라우터 설정
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});



app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// 세션 설정
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/villa-parking',
    collectionName: 'sessions'
  }),
  cookie: { secure: false }
}));

// 미들웨어: 세션 존재 여부 확인 및 로그 출력
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
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    console.log('Invalid credentials');
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log('Invalid credentials');
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  req.session.user = { id: user._id, username: user.username };
  console.log(`Session created: ${JSON.stringify(req.session)}`); // 세션 생성 로그
  res.json({ message: 'Login successful', token: 'dummy-token-for-testing' });
});

app.post('/logout', (req, res) => {
  console.log(`Session before destroy: ${JSON.stringify(req.session)}`); // 세션 삭제 전 로그
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    console.log('Session destroyed'); // 세션 삭제 로그
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