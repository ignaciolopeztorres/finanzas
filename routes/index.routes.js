import express from 'express';
import ViewsController from '../controllers/Views.controller.js';

var router = express.Router();

//router.all('*', function(req, res, next){
//    res.status(200).send('adasd');
//});
/* GET home page. */
router.get('/', ViewsController.renderHome );

/** GET Dashboard */
router.get('/dashboard', ViewsController.dashboard);

export default router;