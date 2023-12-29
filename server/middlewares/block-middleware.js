const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
    try {
        if(req.user.isBlocked){
            return next(ApiError.BlockedError());
        }

        next();
    } catch(e) {
        return next(ApiError.BlockedError());
    }
}