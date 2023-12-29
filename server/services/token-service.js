const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:"30m"})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:"30d"})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await prisma.token.findUnique({where:{
            userId:+userId
        }})
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return await prisma.token.update({
                where: {
                    userId: +userId
                },
                data: {
                    refreshToken: refreshToken
                }
            })
        }
        const token = await prisma.token.create({
            data:{
                userId:+userId,
                refreshToken:refreshToken
            }
        })
        return token;
    }

    async removeToken(refreshToken){
        const tokenData = await prisma.token.delete({where:{
            refreshToken:refreshToken
        }});
        return tokenData;
    }

    async findToken(refreshToken){
        const tokenData = await prisma.token.findFirst({where:{
            refreshToken:refreshToken
        }});
        return tokenData;
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch(e) {
            return null;
        }
    }

    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch(e) {
            return null;
        }
    }
}

module.exports = new TokenService();