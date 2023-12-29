const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../exceptions/api-error')

class FilmService{

    async postFilm(year, duration, name, slogan, description, age, budget, charge, writer){
        if(+year==0 || +duration==0 || name=='' || +age==0 || writer=='')
            throw ApiError.BadRequest('Введите все необходимые данные');
        const film = await prisma.films.create({
            data:{
                name: name,
                description: description,
                year: +year,
                duration: +duration,
                slogan: slogan,
                age: +age,
                budget: +budget,
                charge: +charge,
                writer: writer
            }
        })
        return {film: film}
    }

    async putFilm(id, year, duration, name, slogan, description, age, budget, charge, writer){
        if(+year==0 || +duration==0 || name=='' || +age==0 || writer=='')
            throw ApiError.BadRequest('Введите все необходимые данные');
        const film = await prisma.films.update({
            where:{
                id: +id
            },
            data:{
                name: name,
                description: description,
                year: +year,
                duration: +duration,
                slogan: slogan,
                age: +age,
                budget: +budget,
                charge: +charge,
                writer: writer
            }
        })
        return {film: film}
    }

    async deleteFilm(id){
        const check = await prisma.films.findFirst({
            where:{
                id: +id
            }
        })
        if(!check){
            throw ApiError.BadRequest('Такого фильма нет в каталоге сайта');
        }
        await prisma.reviews.deleteMany({
            where:{
                filmId: +id
            }
        })
        await prisma.user_films.deleteMany({
            where:{
                filmId: +id
            }
        })
        await prisma.image.deleteMany({
            where:{
                filmId: +id
            }
        })
        await prisma.films_genres.deleteMany({
            where:{
                filmId: +id
            }
        })
        const film = await prisma.films.delete({
            where:{
                id: +id
            }
        })
        return {film: film}
    }

    async getAllFilms(){
        const film = await prisma.films.findMany()
        return {film: film}
    }

    async getFilmById(id){
        const film = await prisma.films.findFirst({
            where: {
                id: +id
            }
        });
        return {film: film}
    }

    async getFilmsByGenre(genre){
        const films = await prisma.films.findMany({
            where: {
              films_genres: {
                some: {
                  genre: genre
                }
              }
            }
        });
        return {films: films}
    }

    async getFilmsByPerson(person){
        const films = await prisma.films.findMany({
            where: {
                employees: {
                    some: {
                        employeeId: employeeId
                    }
                }
            }
        });
        return {film: films}
    }

    async getFirstCoverImageOfFilm(id) {
        const image = await prisma.image.findFirst({
          where: {
            filmId: +id,
            isCover: true,
          },
          select: {
            uri: true,
          },
        });
      
        return {image: image};
    }

    async getGenresByFilm(id){
        const genres = await prisma.films_genres.findMany({
            where:{
                filmId: +id
            },
            select:{
                genre: true
            }
        })
        return {genres: genres}
    }

    async getFilmsBySearch(text){
        console.log("sssss: "+text)
        if(text===""){
            const films = await prisma.films.findMany();
            return {films: films};
        }
        const films = await prisma.films.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: text
                        }
                    },
                    {
                        writer: {
                            contains: text
                        }
                    }
                ]
            }
          });
        return {films: films};
    }
    
    async putImage(id, uri){
        const check = await prisma.image.findFirst({
            where:{
                filmId: +id,
                isCover: true
            }
        })
        if(check){
            const image = await prisma.image.update({
                where:{
                    id: +check.id,
                },
                data:{
                    uri: uri
                }
            })
            return {image: image}
        } else {
            const image = await prisma.image.create({
                data:{
                    uri: uri,
                    isCover: true,
                    filmId: +id
                }
            })
            return {image: image}
        }
    }

    async postImage(id, uri){
        const image = await prisma.image.create({
            data:{
                uri: uri,
                filmId: +id,
                isCover: true
            }
        })
        return {image: image}
    }

    async putGenres(id, genreTitle){
        await prisma.films_genres.deleteMany({
            where:{
                filmId: +id
            }
        })
        const genre = await prisma.films_genres.create({
            data:{
                filmId: +id,
                genre: genreTitle
            }
        }) 
        return {genre:genre}
    }

    async getSortedFilms(category){
        const films = await prisma.films.findMany();

        const filmsWithCount = await Promise.all(
            films.map(async (film) => {
            const count = await prisma.user_films.count({
                where: {
                category: category,
                filmId: film.id
                }
            });
            return { ...film, count };
            })
        );

        const sortedFilms = filmsWithCount.sort((a, b) => b.count - a.count);
        return {films: sortedFilms}
    }
}

module.exports = new FilmService();