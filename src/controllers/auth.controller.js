const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken'); 
const config = require('../config');

const User = require('../models/user');

require('../models/user');

router.post('/signup', async(req, res, next) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    user.password = await user.encryptPassword(user.password);

    await user.save();

    const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 60 * 60 * 24
    });

    res.json({ auth: true, token });
})

router.get('/me', async (req, res, next) => {

    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json({
            auth: false,
            message: 'Not token provided'
        });
    }

    const decoded = jwt.verify(token, config.secret);

    const user = await User.findById(decoded.id, { password: 0 } );

    if(!user) {
        return res.status(404).send('User not found');
    }

    res.json(user);
})

router.post('/signin', async(req, res, next) => {

    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if(!user) {
        return res.status(404).send('The email doesnt exists');
    }

    const passIsValid = await user.validatePassword(password);

    if(!passIsValid) {
        return res.status(401).json({ auth: false, token: null })
    }

    jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 60 * 60 * 24
    })

    res.json({ auth: true, token });
})


module.exports = router;