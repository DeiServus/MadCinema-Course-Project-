import $api from "../http";

export default class MailService {

    static sendMail(id, message){
        return $api.post('/sendmail', {id, message});
    }
}