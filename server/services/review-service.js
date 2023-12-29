const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class ReviewService{
    async postReview(text, mark, userId, filmId){
        const check = await prisma.reviews.findFirst({
            where:{
                AND:{
                    filmId: +filmId,
                    userId: +userId
                }
            }
        })

        if(check){
            const review = await prisma.reviews.update({
                where:{
                    userId_filmId:{
                        userId: +userId,
                        filmId: +filmId
                    }
                },
                data:{
                    mark: +mark,
                    text: text
                }
            })
            return {review: review}
        } else {
            const review = await prisma.reviews.create({
                data:{
                    userId: +userId,
                    filmId: +filmId,
                    mark: +mark,
                    text: text,
                    rating: 0
                }
            })
            return {review: review}
        }
    }

    async putReviewText(text, userId, filmId){
        const review = await prisma.reviews.create({
            where:{
                AND:{
                    userId: userId,
                    filmId: filmId
                }
            },
            data:{
                text: text
            }
        })
        return {review: review}
    }

    async putReviewMark(mark, userId, filmId){
        const review = await prisma.reviews.create({
            where:{
                AND:{
                    userId: userId,
                    filmId: filmId
                }
            },
            data:{
                mark: mark
            }
        })
        return {review: review}
    }

    async deleteReview(id){
        const review = await prisma.reviews.delete({
            where:{
                id: id
            }
        })
        return {review: review}
    }

    async getAllReviews(){
        const review = await prisma.reviews.findMany();
        return {review: review}
    }

    async getReviewById(id){
        const review = await prisma.reviews.findFirst({
            where:{
                id: id
            }
        });
        return {review: review}
    }

    async getReviewByFilm(id){
        const review = await prisma.reviews.findMany({
            where:{
                filmId: +id,
                text: {
                    not: null
                }
            }
        });
        return {review: review}
    }

    async getReviewByUserId(userId){
        const review = await prisma.reviews.findMany({
            where:{
                userId: userId
            }
        });
        return {review: review}
    }

    async getAverageMark(id){
        const averageMark = await prisma.reviews.aggregate({
            where: {
              filmId: +id
            },
            _avg: {
              mark: true
            }
        });
        return {mark: averageMark};
    }
}

module.exports = new ReviewService();