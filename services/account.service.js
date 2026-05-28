import User from '../models/user.model.js'; // Ajustar según tu modelo
import cuentaService from '../services/cuentas.service.js';

    
/**
 * modelo de servicio para gestión de cuentas de usuario
 * - register: registro de nuevo usuario
 * - login: autenticación de usuario
 * - getProfile: obtener perfil del usuario autenticado
 * - changePassword: cambiar contraseña del usuario
 * - logout: cerrar sesión del usuario
 */
class AccountService {
    constructor() { }

    // Obtener perfil (se asume middleware de auth que pone req.user)
    // Si no existe middleware, intenta verificar token Authorization Bearer
    async getProfile(req, res) {
        try {
            // Assumes an auth middleware has set req.userId
            let userId = req.user && req.user.id;
            if (!userId) {
                const auth = req.headers.authorization;
                if (!auth) return res.status(401).json({ message: 'No autorizado' });
                
                const token = auth.split(' ')[1];
                const payload = jwt.verify(token, JWT_SECRET);
                userId = payload.id;
            }

            const user = await User.findById(userId).select('-password -__v');
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

            res.json({ user });
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'Token inválido o expirado' });
        }
    }

    /**
     * Cambiar contraseña de usuario
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async changePassword(req, res) {
        try {
            const userId = req.user && req.user.id;
            if (!userId) return res.status(401).json({ message: 'No autorizado' });

            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Faltan datos' });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) return res.status(401).json({ message: 'Contraseña actual incorrecta' });

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.json({ message: 'Contraseña actualizada' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error interno' });
        }
    }
}
export default new AccountService();