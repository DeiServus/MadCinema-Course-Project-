import $api from "../http";

export default class UserService{
    static getAllUsers(){
        return $api.get('/users');
    }

    static postUser(email, password, login){
        return $api.post('/adduser', {email, password, login});
    }

    static putUser(id, login){
        return $api.put('/user', {id, login})
    }

    static block(id){
        return $api.put('/block', {id})
    }

    static getNameById(id){
        return $api.get(`/name/${id}`);
    }

    static getEmailById(id){
        return $api.get(`/email/${id}`);
    }
}