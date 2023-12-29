const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../exceptions/api-error')

class UserFilmService {
    async postFilmToCategory(userId, filmId, category){
        const chck = await this.check(userId, filmId, category);
        if(chck){
            throw ApiError.BadRequest('Фильм уже добавлен в список');
        }
        if(category=="favourite" || category=="watch" || category=="watched"){
            throw ApiError.BadRequest('Введите другое название');
        }

        const film = await prisma.user_films.create({
            data: {
                userId: +userId,
                filmId: +filmId,
                category: category
            }
        })
        return {film: film}
    }

    async postFilmToFavourite(userId, filmId){
        const chck = await this.check(userId, filmId, "favourite");
        if(chck){
            throw ApiError.BadRequest('Фильм уже добавлен в список');
        }
        const film = await prisma.user_films.create({
            data: {
                userId: userId,
                filmId: filmId,
                category: "favourite"
            }
        })
        return {film: film}
    }

    async postFilmToWatched(userId, filmId){
        if(await this.check(userId, filmId, "watched")){
            throw ApiError.BadRequest('Фильм уже добавлен в список');
        }
        const film = await prisma.user_films.create({
            data: {
                userId: userId,
                filmId: filmId,
                category: "watched"            }
        })
        return {film: film}
    }

    async postFilmToWatch(userId, filmId){
        if(await this.check(userId, filmId, "watch")){
            throw ApiError.BadRequest('Фильм уже добавлен в список');
        }
        const film = await prisma.user_films.create({
            data: {
                userId: userId,
                filmId: filmId,
                category: "watch"
            }
        })
        return {film: film}
    }

    async deleteCategory(category){
        const film = await prisma.user_films.deleteMany({
            where:{
                category: category
            }
        })
        return {film: film}
    }

    async deleteFromCategory(id, category, uid){
        const film = await prisma.user_films.delete({
            where: {
                userId_filmId_category: {
                  userId: +uid,
                  filmId: +id,
                  category: category
                }
              }
        })
        return {film: film}
    }

    async getFilmsByCategory(userId, category){
        const films = await prisma.user_films.findMany({
            where: {
              userId: userId,
              category: category
            },
            include: {
              films: true
            }
        });
        return {films: films}
    }

    async getCategoriesByUserId(userId){
        const userCategories = await prisma.user_films.findMany({
            where: {
              userId: userId,
            },
            select: {
              category: true,
            },
            distinct: ['category'],
        });
        return {films: userCategories};
    }

    async getCountByCategory(category, filmId){
        const count = await prisma.user_films.count({
            where:{
                category: category,
                filmId: +filmId
            }
        });
        return count;
    }

    async check(userId, filmId, category){
        const check = await prisma.user_films.findMany({
            where:{
                userId: +userId,
                filmId: +filmId,
                category: category
            }
        })
        if(check.length==0){
            return false
        }
        else
        return true
    }
}

module.exports = new UserFilmService();