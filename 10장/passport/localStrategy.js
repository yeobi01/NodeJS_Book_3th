const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
        passReqToCallback: false
    }, async(email, password, done) => { // done(서버실패, 성공유저, 로직실패)
        try {
            const exUser = await User.findOne({ where: { email }});
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                } else{
                    done(null, false, { message: '비밀번호 일치하지 않습니다.' })
                }
            } else{
                done(null, false, { message: '가입되지 않은 회원입니다.' })
                // done이 호출되면 controllers/auth.js의 login부분의 콜백함수로 가짐
            }
        } catch (error) {
            console.error(error);          
            done(error);  
        }
    }));
};