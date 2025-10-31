import User from "../models/user.model.js";
import accountService, { TokenService } from "../services/account.service.js";

class UserController {
    constructor() { }

    // Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
    // Obtener un usuario por ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Crear un nuevo usuario
    async createUser(req, res) {
        try { 

            const newUser = await accountService.register(req);
            console.log(newUser);

            if (!newUser) {
                return res.status(404).json({ error: "Usert Not create"})
            }
            res.status(newUser.status).json(newUser);
        } catch (error) {
            console.error('Error creating user: ', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
    // Actualizar un usuario
    async updateUser(req, res) {
        try {
            const userId = req.user && req.user.id;
            console.log('Authenticated user ID:', req.user);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { username, name, email, role, id } = req.body;
            const user = await User.findOne({ where: { idUSer: id}});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.update({ username, name, email, role});
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Actualizar contraseña de usuario
    async updatePassword(req, res) {
        try {
            const { password, id } = req.body;
            const passwordHash = password;
            const user = await User.findOne({ where: { idUSer: id}});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.update({ passwordHash });
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Eliminar un usuario
    async deleteUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default new UserController();