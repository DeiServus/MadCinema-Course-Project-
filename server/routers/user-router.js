const express = require('express');

const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');
const mailController = require('../controllers/mail-controller');
const userController = require('../controllers/user-controller');

router.post('/registration',
            body('email').isEmail(),
            body('password').isLength({min:3, max:32}),
            body('login').isLength({min:3, max:32}),
            userController.registration);

router.post('/adduser',
            body('email').isEmail(),
            body('password').isLength({min:3, max:32}),
            userController.addUser);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.get('/activate/:link', 
    userController.activate);
    
router.get('/refresh', 
    userController.refresh);

router.get('/users',
    authMiddleware,
    userController.getUsers);

router.put('/user',
    authMiddleware,
    userController.putUserLogin)

router.post('/deleteuser', 
    authMiddleware, 
    userController.deleteUser);

router.post('/sendmail', 
    authMiddleware, 
    mailController.sendMessageMail);

router.put('/block',
    authMiddleware,
    roleMiddleware,
    userController.blockUser)

router.get('/name/:id',
    authMiddleware,
    userController.getNameById
)

router.get('/email/:id',
    authMiddleware,
    userController.getEmailById
)

module.exports = router