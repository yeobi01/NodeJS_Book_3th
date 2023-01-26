exports.renderProfile = (req, res, next) => {
    res.render('profile', { title: '내 정보 - NodeBird'});
};
exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원 가입 - NodeBird'});
};
exports.renderMain = (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
    });
};

// 컨트롤러 : 서비스를 호출함
// 라우터 -> 컨트롤러(요청, 응답 안다) -> 서비스(요청, 응답 모른다)