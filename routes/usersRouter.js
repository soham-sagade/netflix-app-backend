const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../auth/auth');


//register && login
router.post('/register', userController.register);
router.post('/login', userController.login);

//RUD
router.put('/user/:id', auth.verifyToken, userController.update);
router.delete('/user/:id', auth.verifyToken, userController.delete);
router.get('/user/:id', auth.verifyToken, userController.getUser);
router.get('/users', auth.verifyToken, userController.getUsers);

//stats
router.get('/users/stats', auth.verifyToken, userController.stats);
module.exports = router ;