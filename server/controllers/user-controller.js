const ApiError = require("../exceptions/api-error");
const userService = require("../services/user-service");
const {validationResult} = require('express-validator');


class UserController{
    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации:\nдлина пароля от 3 до 32, верный ввод почты и т.д.', errors.array()))
            }
            const {email, password, login} = req.body;
            const userData = await userService.registration(email, password, login);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }

    async addUser(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации:\nдлина пароля от 3 до 32, верный ввод почты и т.д.', errors.array()))
            }
            const {email, password, login} = req.body;
            const userData = await userService.postUser(email, password, login);
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }

    async login(req, res, next){
        try{
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }

    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }catch(e){
            next(e);
        }
    }

    async activate(req, res, next){
        try{
            const activateLink = req.params.link;
            await userService.activate(activateLink);
            return res.redirect(process.env.CLIENT_URL);
        }catch(e){
            next(e);
        }
    }

    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }

    async getUsers(req, res, next){
        try{
            const users = await userService.getAllUser();
            return res.json(users)
        }catch(e){
            next(e);
        }
    }

    async deleteUser(req, res, next){
        try{
            const {id} = req.body;
            const users = await userService.deleteUser(id);
            return res.json(users)
        }catch(e){
            next(e);
        }
    }

    async putUserLogin(req, res, next){
        try{
            const {id, login} = req.body;
            const users = await userService.putUserLogin(id, login);
            return res.json(users);
        } catch(e) {
            next(e)
        }
    }

    async blockUser(req, res, next){
        try{
            const {id} = req.body;
            const user = await userService.blockUser(id);
            return res.json(user);
        } catch(e) {
            next(e)
        }
    }

    async getNameById(req, res, next){
        try {
            const {id} = req.params;
            const name = await userService.getNameById(id);
            return res.json(name);
        } catch (e) {
            next(e)
        }
    }

    async getEmailById(req, res, next){
        try {
            const {id} = req.params;
            const email = await userService.getEmailById(id);
            return res.json(email);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();