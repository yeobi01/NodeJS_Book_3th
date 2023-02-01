const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const { sequelize } = require('./models');

dotenv.config(); // process.env
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const profileRouter = require('./routes/profile');
const passportConfig = require('./passport');
const { application } = require('express');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize.sync()
    .then(() => {
        console.log('데이터베이스 연결 성공')
    })
    .catch((err) => {
        console.error(err);
    })

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'))); // public폴더를 프론트에서 접근할 수 있도록 허용
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // req.body 폼 요청 받을 수 있음
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session( {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COKKIE_SECRET, // .env로 숨기기
    cookie: {
        httpOnly: true,
        secure: false, // https 적용할 때 true
    }
}))
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/profile', profileRouter);

app.use((req, res, next) => { // 404 NOT FOUND
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 에러 로그를 서비스한테 넘기기
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});