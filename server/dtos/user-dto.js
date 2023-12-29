module.exports = class UserDto{
    email;
    id;
    iSActivated;
    role;

    constructor(model){
        this.email = model.email;
        this.iSActivated = model.isActivated;
        this.id = model.id;
        this.role = model.role;
    }
}