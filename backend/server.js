const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

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
