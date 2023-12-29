const ApiError = require("../exceptions/api-error");
const userFilmService = require("../services/user-film-service");

class UserFilmController{
    async postFilmToCategory(req, res, next){
        try{
            const {userId, filmId, category} = req.body;
            const film = await userFilmService.postFilmToCategory(userId, filmId, category);
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async postFilmToFavourite(req, res, next){
        try{
            const {userId, filmId} = req.body;
            const film = await userFilmService.postFilmToFavourite(userId, filmId, "favourite");
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async postFilmToWatch(req, res, next){
        try{
            const {userId, filmId} = req.body;
            const film = await userFilmService.postFilmToWatch(userId, filmId, "watch");
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async postFilmToWatched(req, res, next){
        try{
            const {userId, filmId} = req.body;
            const film = await userFilmService.postFilmToWatched(userId, filmId, "watched");
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async deleteCategory(req, res, next){
        try{
            const {category} =  req.body;
            const films = await userFilmService.deleteCategory(category);
            return res.json(films)
        } catch(e) {
            next(e);
        }
    }

    async deleteFromCategory(req, res, next){
        try{
            const {id, category, uid} =  req.params;
            const films = await userFilmService.deleteFromCategory(id, category, uid);
            return res.json(films)
        } catch(e) {
            next(e);
        }
    }

    async getFilmsByCategory(req, res, next){
        try{
            const {userId, category} =  req.body;
            const films = await userFilmService.getFilmsByCategory(userId, category);
            return res.json(films)
        } catch(e) {
            next(e);
        }
    }    

    async getCategoriesByUserId(req, res, next){
        try{
            const {userId} = req.body;
            const categories = await userFilmService.getCategoriesByUserId(userId);
            return res.json(categories)
        } catch(e) {
            next(e);
        }
    }

    async getCountByCategory(req, res, next){
        try {
            const {category, filmId} = req.params;
            const count = await userFilmService.getCountByCategory(category, filmId);
            return res.json(count);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserFilmController();