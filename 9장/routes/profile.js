const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { update } = require('../controllers/profile');
const router = express.Router();

// POST /profile/update
router.post('/update', isLoggedIn, update);

module.exports = router;