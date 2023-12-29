const express = require('express');

const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const userFilmController = require('../controllers/user-film-controller');

router.post('/ufilm/category',
    authMiddleware,
    userFilmController.postFilmToCategory);

router.post('/ufilm/favourite',
    userFilmController.postFilmToFavourite);

router.post('/ufilm/watch',
    authMiddleware,
    userFilmController.postFilmToWatch);

router.post('/ufilm/watched',
    authMiddleware,
    userFilmController.postFilmToWatched);

router.delete('/ufilm/:id/:category/:uid',
    authMiddleware,
    userFilmController.deleteFromCategory);

router.delete('/ufilm/category',
    authMiddleware,
    userFilmController.deleteCategory);

router.post('/ufilms',
    authMiddleware,
    userFilmController.getFilmsByCategory);

router.post('/ufilm/ucategory',
    authMiddleware,
    userFilmController.getCategoriesByUserId);

router.get('/count/:filmId/:category',
    authMiddleware,
    userFilmController.getCountByCategory);

module.exports = router