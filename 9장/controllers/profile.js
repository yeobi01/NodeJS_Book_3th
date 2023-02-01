const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.update = async (req, res, body) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email }});
        if(exUser) {
            const hash = await bcrypt.hash(password,12);
            await exUser.update({
                email: email,
                nick: nick,
                password: hash,
            })
            return res.redirect('/');
        } else {
            
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
}