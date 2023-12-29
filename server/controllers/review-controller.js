const ApiError = require("../exceptions/api-error");
const reviewService = require("../services/review-service");

class ReviewController{
    async postReview(req, res, next){
        try {
            const {text, mark, userId, filmId} = req.body;
            const review = await reviewService.postReview(text, mark, userId, filmId);
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async putReviewMark(req, res, next){
        try {
            const {mark, userId, filmId} = req.body;
            const review = await reviewService.putReviewMark(mark, userId, filmId);
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async putReviewText(req, res, next){
        try {
            const {text, userId, filmId} = req.body;
            const review = await reviewService.putReviewText(text, userId, filmId);
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async deleteReview(req, res, next){
        try {
            const {id} = req.body;
            const review = await reviewService.deleteReview(id);
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async getAllReviews(req, res, next){
        try {
            const review = await reviewService.getAllReviews();
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async getReviewById(req, res, next){
        try {
            const {id} = req.body;
            const review = await reviewService.getReviewById(id);
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async getReviewByFilm(req, res, next){
        try {
            const {fid} = req.params;
            const review = await reviewService.getReviewByFilm(fid);
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async getReviewByUserId(req, res, next){
        try {
            const {userId} = req.body;
            const review = await reviewService.getReviewById(userId);
            return res.json(review);
        } catch(e) {
            next(e)
        }
    }

    async getAverageMark(req, res, next){
        try {
            const {id} = req.params;
            const mark = await reviewService.getAverageMark(id);
            return res.json(mark);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ReviewController();