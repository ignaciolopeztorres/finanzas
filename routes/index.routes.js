import express from 'express';
import ViewsController from '../controllers/Views.controller.js';

var router = express.Router();

/* GET home page. */
router.get('/', ViewsController.renderHome );

export default router;