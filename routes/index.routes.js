import express from 'express';
import ViewsController from '../controllers/Views.controller.js';
import authController from '../controllers/auth.controller.js';

var router = express.Router();

//router.all('*', function(req, res, next){
//    res.status(200).send('adasd');
//});
/* GET home page. */
router.get('/', ViewsController.renderHome);

/** GET Dashboard */
router.get('/dashboard', ViewsController.dashboard);

/** GET Categories */
router.get('/categories', ViewsController.categories);
/** GET Operations */
router.get('/operations', ViewsController.operations);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;