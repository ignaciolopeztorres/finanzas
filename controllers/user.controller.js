import User from "../models/user.model.js";
import AccountService, { TokenService } from "../services/account.service.js";

class UserController {
    constructor() { }

    // Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            TokenService.generateRefreshToken()
            ts.deleteUser
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
            const { username, name, email, password, role } = req.body;
            const passwordHash = password;

            const newUser = await User.create({ username, name, email, passwordHash, role });
            if (!newUser) {
                return res.status(404).json({ error: "Usert Not create"})
            }
            res.status(201).json(newRegisterUser);
        } catch (error) {
            console.error('Error creating user: ', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
    // Actualizar un usuario
    async updateUser(req, res) {
        try {
            const { username, name, email, password, role, id } = req.body;
            const passwordHash = password;
            const user = await User.findOne({ where: { idUSer: id}});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await user.update({ username, name, email, passwordHash, role});
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
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