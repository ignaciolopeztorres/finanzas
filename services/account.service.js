import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Ajustar según tu modelo

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;

/**
 * Servicio para generación y verificación de tokens JWT
 * - generateAccessToken: genera token de acceso
 * - generateRefreshToken: genera token de refresco
 */
class TokenService {
    constructor() { }
    // Genera tokens
    static generateAccessToken(user) {
        return jwt.sign({ id: user.idUser, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    static generateRefreshToken(user) {
        console.log(user);
        return jwt.sign({ id: user.idUser }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
    }
    static async generateHashPassword(password) {
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
    }
}
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

    // Registro de usuario
    async register(req) {
        try {
            const { username, name, email, password, role } = req.body;
            if (!email || !password) return { status: 400, message: 'Email y contraseña requeridos' };

            const existing = await User.findOne({ where: { email: email.toLowerCase() } });
            if (existing) return { status: 409, message: 'Usuario ya registrado' };

            //hashed password
            const hashed = await TokenService.generateHashPassword(password);
            console.log(hashed);
            const user = await User.create({ username, name, email: email.toLowerCase(), passwordHash: hashed, role });
            //const user = new User();
            //await user.save();

            const accessToken = TokenService.generateAccessToken(user);
            //const refreshToken = TokenService.generateRefreshToken(user);
            console.log('access token', accessToken);
            // Opcional: guardar refreshToken en DB si se quiere invalidar después
            // user.refreshToken = refreshToken; await user.save();

            return {
                status: 201,
                user: { id: user.idUser, name: user.name, email: user.email },
                accessToken,
                //refreshToken
            };
        } catch (err) {
            console.error(err);
            return { status: 500, message: 'Error interno', error: err.message };
        }
    }

    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return { status: 400, message: 'Email y contraseña requeridos' };

            // Buscar usuario
            const user = await User.findOne({ where: { email: email.toLowerCase() } });
            if (!user) return { status: 401, message: 'Credenciales inválidas ___V' };

            // Verificar contraseña

            const match = await bcrypt.compare(password, user.passwordHash);
            if (!match) return { status: 401, message: 'Credenciales inválidas ___P' };

            const accessToken = TokenService.generateAccessToken(user);
            //const refreshToken = TokenService.generateRefreshToken(user);

            // Envío de refresh token como cookie httpOnly (opcional)
            //res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000 });

            return {
                id: user.idUser,
                name: user.name,
                email: user.email,
                role: user.role,
                username: user.username,
                accessToken,
                //refreshToken
                status: 200,
                message: 'Login exitoso'
            };
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error interno service login' });
        }
    }

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

    // Logout (limpia cookie si se usa)
    async logout(req, res) {
        try {
            const token = req.cookies?.refreshToken || req.body.refreshToken;
            if (token) {
                // Try to find user and clear stored refresh token
                try {
                    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
                    await User.findByIdAndUpdate(payload.id, { $unset: { refreshToken: 1 } });
                } catch (_) { /* ignore invalid token */ }
            }

            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
            return res.json({ message: 'Logged out' });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
}
export default new AccountService();
export { TokenService };