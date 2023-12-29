const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const uuid = require('uuid');
const mailService = require('./mail-service')
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const bcrypt = require('bcrypt');
const ApiError = require('../exceptions/api-error')


class UserService{
    async registration(email, password, login){
        const candidate = await prisma.user_profile.findFirst({ where: { email: email } });
        if(email=='' || password=='' || login==''){
            throw ApiError.BadRequest('Поля должны быть заполнены');
        }
        if (candidate) {
            throw ApiError.BadRequest('email already exists');
        }
        const hashPassword = bcrypt.hashSync(password, 3);
        const activateLink = uuid.v4();

        const user = await prisma.user_profile.create({
            data:{
                login: login,
                email: email,
                role: "user",
                password:hashPassword,
                activationLink:activateLink
            }
        })

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activateLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user:user}
    }

    async postUser(email, password, login){
        const candidate = await prisma.user_profile.findFirst({ where: { email: email } });
        if (candidate) {
            throw ApiError.BadRequest('email already exists');
        }
        const hashPassword = bcrypt.hashSync(password, 3);
        const activateLink = uuid.v4();
        const user = await prisma.user_profile.create({
            data:{
                login: login,
                email: email,
                role: "user",
                password: hashPassword,
                activationLink: activateLink,
                isActivated: true,
                isBlocked: false
            }
        })
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        return {...tokens, user:user}
    }

    async activate(al){
        const user = await prisma.user_profile.findFirst({ where: { activationLink: al } });
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }
        await prisma.user_profile.update({
            where:{id: user.id},
            data:{isActivated: true}
        })
    }

    async login(email, password){
        const user = await prisma.user_profile.findFirst({ where: { email: email } });
        if(email=='' || password==''){
            throw ApiError.BadRequest('Поля должны быть заполнены');
        }
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }
        const isPassEquels = await bcrypt.compare(password, user.password);
        if (!isPassEquels) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        
        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user:user}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
       
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        const user = await prisma.user_profile.findFirst({where:{
            id:userData.id
        }})
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user:userDto}
    }

    async deleteUser(id){
        const user = await prisma.user_profile.findFirst({ where: { id: id } });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким id не найден');
        }
        await prisma.user_films.deleteMany({
            where: {
              user_id: id,
            },
        })
        await prisma.reviews.deleteMany({
            where: {
              user_id: id
            },
        })
        await prisma.token.deleteMany({
            where: {
              userId: id,
            },
        })
        const users = await prisma.user_profile.delete({where:{id:id}});
        return users;
    }

    async getAllUser(){
        const users = await prisma.user_profile.findMany({
            where: {
                role: {
                    not: "admin"
                }
            }
        });
        return users;
    }

    async blockUser(id){
        const user = await prisma.user_profile.findUnique({
            where: { id: +id },
        });
        if (user) {
            const updatedUser = await prisma.user_profile.update({
                where: { id: +id },
                data: { isBlocked: !user.isBlocked },
            });
            return updatedUser;
        } else {
            throw ApiError.BadRequest('User not found');
        }
    }

    async putUserLogin(id ,login){
        const user = await prisma.user_profile.update({
            where:{
                id: +id
            },
            data:{
                login: login
            }
        });
        return user;
    }

    async getNameById(id){
        const user  = await prisma.user_profile.findFirst({
            where:{
                id: +id
            }
        })
        return {name: user.login};
    }

    async getEmailById(id){
        const user  = await prisma.user_profile.findFirst({
            where:{
                id: +id
            }
        })
        return {email: user.email};
    }
}

module.exports = new UserService();