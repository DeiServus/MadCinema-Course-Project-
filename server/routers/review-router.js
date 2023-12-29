const express = require('express');

const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const reviewController = require('../controllers/review-controller');

router.post('/review',
    authMiddleware,
    reviewController.postReview);

router.put('/review/mark',
    authMiddleware,
    reviewController.putReviewMark);

router.put('/review/text',
    authMiddleware,
    reviewController.putReviewText);

router.delete('/review',
    authMiddleware,
    reviewController.deleteReview);

router.get('/reviews',
    authMiddleware,
    reviewController.getAllReviews);

router.get('/review',
    authMiddleware,
    reviewController.getReviewById);

router.get('/reviews/userid',
    authMiddleware,
    reviewController.getReviewByUserId);

router.get('/reviews/:fid',
    authMiddleware,
    reviewController.getReviewByFilm);

router.get('/mark/:id',
    authMiddleware,
    reviewController.getAverageMark);

module.exports = router