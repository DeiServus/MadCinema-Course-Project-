const ApiError = require("../exceptions/api-error");

module.exports = function (req, res, next) {
    try {
        if(req.user.role!="admin"){
            return next(ApiError.NotAdminError());
        }

        next();
    } catch(e) {
        return next(ApiError.NotAdminError());
    }
}