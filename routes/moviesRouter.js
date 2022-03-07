const router = require('express').Router();
const auth = require('../auth/auth')
const movieController = require('../controllers/movieController');


router.post('/newMovie', auth.verifyToken, movieController.createMovie);
router.get('/movie/:id', auth.verifyToken, movieController.getMovie);
router.get('/movies', auth.verifyToken, movieController.getMovies);
router.get('/getRandom', auth.verifyToken, movieController.getRandom);
router.put('/updateMovie/:id', auth.verifyToken, movieController.updateMovie);
router.delete('/deleteMovie/:id', auth.verifyToken, movieController.deleteMovie);


module.exports = router;