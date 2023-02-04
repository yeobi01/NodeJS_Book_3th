const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderJoin, updateProfile, renderMain, renderProfile, renderHashtag, renderContent } = require('../controllers/page');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Following?.map(f => f.id) || [];
    res.locals.likeCount = req.user?.Likes?.length || 0;
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
router.get('/update', isLoggedIn, updateProfile);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/hashtag', renderHashtag); // hashtag?hashtag=고양이
router.get('/content', renderContent);

module.exports = router;