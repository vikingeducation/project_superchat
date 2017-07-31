const user = (req, res, next) => {
    let user = req.cookies.user || {};

     req.user = user;   

    next();
}

module.exports = user;

