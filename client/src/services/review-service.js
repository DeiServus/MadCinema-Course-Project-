import $api from "../http";

export default class ReviewService{
    static getAverageMark(id){
        return $api.get(`/mark/${id}`);
    }

    static postReview(userId, filmId, mark, text){
        return $api.post('/review', {text, mark, userId, filmId})
    }

    static getAllReviews(){
        return $api.get('/reviews');
    }

    static getReviewsByFilm(fid){
        return $api.get(`/reviews/${fid}`);
    }
}