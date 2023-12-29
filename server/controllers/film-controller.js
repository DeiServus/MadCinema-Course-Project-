const ApiError = require("../exceptions/api-error");
const filmService = require("../services/film-service");
const {validationResult} = require('express-validator');

class FilmController{
    async postFilm(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации:\nдлина пароля от 3 до 32, верный ввод почты и т.д.', errors.array()));
            }
            const {year, duration, name, slogan, description, age, budget, charge, writer} = req.body;
            const film = await filmService.postFilm(year, duration, name, slogan, description, age, budget, charge, writer);
            return res.json(film);
        } catch(e) {
            next(e)
        }
    }

    async putFilm(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации:\nдлина пароля от 3 до 32, верный ввод почты и т.д.', errors.array()));
            }
            const {id, year, duration, name, slogan, description, age, budget, charge, writer} = req.body;
            const film = await filmService.putFilm(id, year, duration, name, slogan, description, age, budget, charge, writer);
            return res.json(film);
        } catch(e) {
            next(e)
        }
    }

    async deleteFilm(req, res, next){
        try{
            const {id} = req.params;
            const film = await filmService.deleteFilm(id);
            return res.json(film);
        } catch(e) {
            next(e)
        }
    }

    async getAllFilms(req, res, next){
        try{
            const film = await filmService.getAllFilms();
            return res.json(film);
        } catch(e) {
            next(e)
        }
    }

    async getFilmById(req, res, next){
        try{
            const {id} = req.body;
            const film = await filmService.getFilmById(id);
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async getFilmsByGenre(req, res, next){
        try{
            const {genre} = req.body;
            const film = await filmService.getFilmsByGenre(genre);
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async getGenresByFilm(req, res, next){
        try{
            const {id} = req.params;
            const genres = await filmService.getGenresByFilm(id);
            return res.json(genres);
        } catch(e) {
            next(e);
        }
    }

    async getFilmsByPerson(req, res, next){
        try{
            const {person} = req.body;
            const film = await filmService.getFilmsByPerson(person);
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async getFirstCoverImageOfFilm(req, res, next){
        try{
            const {id} = req.body;
            const film = await filmService.getFirstCoverImageOfFilm(id);
            return res.json(film);
        } catch(e) {
            next(e);
        }
    }

    async getFilmsBySearch(req, res, next){
        try{
            const {text} = req.params;
            const films = await filmService.getFilmsBySearch(text);
            return res.json(films);
        } catch(e) {
            next(e);
        }
    }

    async putImage(req, res, next){
        try {
            const {id, uri} = req.body;
            const image = await filmService.putImage(id, uri);
            return res.json(image)
        } catch (e) {
            next(e);
        }
    }

    async postImage(req, res, next){
        try {
            console.log(1)
            const {id, uri} = req.body;
            const image = await filmService.postImage(id, uri);
            return res.json(image)
        } catch (e) {
            next(e);
        }
    }

    async putGenres(req, res, next){
        try {
            const {id, genre} = req.body;
            const genres = await filmService.putGenres(id, genre);
            return res.json(genres);
        } catch (e) {
            next(e)
        }
    }

    async getSortedFilms(req, res, next){
        try {
            const {category} = req.params;
            const films = await filmService.getSortedFilms(category);
            return res.json(films)
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FilmController();