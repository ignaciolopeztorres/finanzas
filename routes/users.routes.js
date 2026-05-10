import express from'express';
import userController from '../controllers/user.controller.js';

var router = express.Router();

/* GET users listing. */
router.get('/', userController.getAllUsers);

/* GET user by ID. */
router.get('/:id', userController.getUserById);

/* POST create user. */
router.post('/', userController.createUser);

/* PUT update user. */
router.put('/:id', userController.updateUser);

/* PUT update user. */
router.put('/:id/changePassword', userController.updatePassword);

/* DELETE user. */
router.delete('/:id', userController.deleteUser);

export default router;
