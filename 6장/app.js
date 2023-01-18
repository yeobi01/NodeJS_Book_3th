const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('요청경로', express.static('실제경로'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.get('/', (req, res, next) => {
    req.session.name = 'zerocho' // 세션 등록
    req.sessionID; // 세션 아이디  확인
    req.session.destroy();  // 세션 모두 제거
});


app.get('/', (req, res, next) => {
    req.cookies;
    res.cookie('name', encodeURIComponent(name), {
        expires: new Date(),
        httpOnly: true,
        path: '/',
    });
    res.cookie('name', encodeURIComponent(name), {
        httpOnly: true,
        path: '/',
    });
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    res.send('hello express');
});

app.get('/about', (req, res) => {
    res.send('hello express');
});

app.get('/about/:wildcard', (req, res) => {
    res.send(`hello ${req.params.wildcard}`);
});

app.use((req, res, next) => {
    res.status(404).send(`404 지롱`);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(200).send(`에러났지롱. 근데 안알려줄거지롱`);
})

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});