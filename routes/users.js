import express from 'express';
var router = express.Router();

import UserController from '../controllers/auth.controller.js';

const userController = new UserController();
// Rutas para usuarios
router.post('/signin', (req, res) => userController.signIn(req, res));
router.post('/signup', (req, res) => userController.signUp(req, res));

export default router;
