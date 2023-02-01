const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        // 해쉬태그를 뽑아내기 위해선 정규표현식을 공부해야함
        // /#[^\s#]*/g 이 해쉬태그의 정규표현식 | 샵과 공백이 아닌 나머지를 뜻함
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags) {
            const result = await Promise.all(hashtags.map((tag) => {
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() }
                });
            }));
            console.log('result', result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.like = async (req, res, next) => {
    try {
        console.log(req.url);
        let idx = req.url.indexOf('/', 1);
        let postId = req.url.substring(1, idx);
        const post = await Post.findOne({ where: { id: postId }});
        if(post){
            await post.addLiking(parseInt(req.params.id, 10));
            res.send('success');
        } else{
            res.status(404).send('no user');
        }
        
    } catch(error){
        console.error(error);
        next(error);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        console.log(req.url);
        let idx = req.url.indexOf('/', 1);
        let postId = req.url.substring(1, idx);
        await Post.destroy({ where: { id: postId }});
        res.redirect('/');
    } catch(error){
        console.error(error);
        next(error);
    }
}