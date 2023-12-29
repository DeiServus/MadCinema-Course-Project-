const express = require('express');

const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const filmController = require('../controllers/film-controller');

router.post('/film',
    authMiddleware,
    filmController.postFilm);

router.put('/film',
    authMiddleware,
    filmController.putFilm);

router.delete('/film/:id',
    authMiddleware,
    filmController.deleteFilm);

router.get('/films',
    authMiddleware,
    filmController.getAllFilms);

router.post('/filmid',
    authMiddleware,
    filmController.getFilmById);

router.post('/films/genre',
    authMiddleware,
    filmController.getFilmsByGenre);

router.get('/films/person',
    authMiddleware,
    filmController.getFilmsByPerson);

router.post('/image',
    authMiddleware,
    filmController.getFirstCoverImageOfFilm);

router.get('/genres/:id',
    authMiddleware,
    filmController.getGenresByFilm);

router.get('/search/:text',
    authMiddleware,
    filmController.getFilmsBySearch);

router.put('/image',
    authMiddleware,
    filmController.putImage);

router.post('/addimage',
    authMiddleware,
    filmController.postImage);

router.put('/genres',
    authMiddleware,
    filmController.putGenres)

router.get('/sort/:category', 
    authMiddleware,
    filmController.getSortedFilms)

module.exports = router