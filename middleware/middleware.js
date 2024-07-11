function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkUserType(userType) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.user_type === userType) {
            return next();
        }
        res.redirect('/login');
    };
}

module.exports = { ensureAuthenticated, checkUserType };