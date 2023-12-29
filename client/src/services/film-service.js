import $api from "../http";

export default class FilmService {
    static getFilms(){
        return $api.get('/films');
    }

    static getImage(id){
        return $api.post('/image', {id});
    }

    static getFilm(id){
        return $api.post('/filmid', {id});
    }

    static toFavourite(userId, filmId){
        return $api.post('/ufilm/favourite', {userId, filmId});
    }

    static toWatched(userId, filmId){
        return $api.post('/ufilm/watched', {userId, filmId});
    }

    static toWatch(userId, filmId){
        return $api.post('/ufilm/watch', {userId, filmId});
    }

    static getUserCategories(userId){
        return $api.post('/ufilm/ucategory', {userId});
    }

    static postFilmToCategory(userId, filmId, category){
        return $api.post('/ufilm/category', {userId, filmId, category});
    }

    static getFilmsByCategory(userId, category){
        return $api.post('/ufilms', {userId, category});
    }

    static getFilmsByGenre(genre){
        return $api.post("/films/genre", {genre});
    }

    static getGenresByFilm(id){
        return $api.get(`/genres/${id}`);
    }

    static deleteFromCategory(id, category, uid){
        return $api.delete(`/ufilm/${id}/${category}/${uid}`);
    }

    static getFilmsBySearch(text){
        return $api.get(`/search/${text}`);
    }

    static deleteFilmById(id){
        return $api.delete(`/film/${id}`);
    }

    static putFilm(id, year, duration, name, slogan, description, age, budget, charge, writer){
        return $api.put('/film', {id, year, duration, name, slogan, description, age, budget, charge, writer})
    }

    static putImage(id, uri){
        return $api.put('/image', {id, uri})
    }

    static postImage(id, uri){
        return $api.post('/addimage', {id, uri})
    }

    static putGenres(id, genre){        
        return $api.put('/genres', {id, genre});
    }

    static async postFilm(year, duration, name, slogan, description, age, budget, charge, writer){
        try {
            const film = await $api.post('/film', {year, duration, name, slogan, description, age, budget, charge, writer})
            return film;
        } catch (e) {
            alert(e.response?.data?.message)
        }
    }

    static getCountByCategory(filmId, category){
        return $api.get(`/count/${filmId}/${category}`)
    }

    static getSortedFilms(category){
        return $api.get(`/sort/${category}`)
    }
}