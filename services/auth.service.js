import bcrypt from "bcryptjs";
import UsersRepository from "../repositories/Users.repository.js";
import  jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/helpers/auth.utils.js";

class AuthService {
    /**
     * Registra el usuario
     * @param {*} username 
     * @param {*} name 
     * @param {*} email 
     * @param {*} password 
     * @returns 
     */
    async register(username, name, email, password) {
        try {
            
            const existing = await UsersRepository.findUserByEmail(email);

            if (existing) throw new Error('Usuario ya registrado');

            //hashed password
            const hashed = await bcrypt.hash(password,10);

            const newUser = await UsersRepository.createUser({ username, name, email: email, passwordHash: hashed, role: 'User' });
            return newUser;
        } catch (err) {
            console.error(err);
            return err.message;
        }
    }

    /**
     * Logea el usuario
     * @param {*} email 
     * @param {*} password 
     * @returns accessToken, refreskToken
     */
    async login(email, password) {
        try {
            // Buscar usuario
            const user = await UsersRepository.findUserByEmail(email);
            if (!user) throw new Error('Credenciales inválidas ___V');

            // Verificar contraseña
            const match = await bcrypt.compare(password, user.passwordHash);
            if (!match) throw new Error('Credenciales inválidas ___P');

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            //console.log('Generated tokens:', { accessToken, refreshToken });

            UsersRepository.saveRefreshToken(refreshToken);

            // Envío de refresh token como cookie httpOnly (opcional)
            //res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000 });

            return  {
                accessToken,
                refreshToken
            };
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    /**
     * refresh token
     * @param {*} token 
     * @returns 
     */
    async refresh(token) {
        try {
            const exists = await UsersRepository.findRefreshToken(token);
            //console.log("exiset",exists);
            if(!exists) throw new Error('Refresh token Invalido');

            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            const newAccesToken = generateAccessToken({id: decoded.id});

            return { accessToken: newAccesToken }
        } catch(err){
            return err;
        }
    }

     /**
      * Logout (limpia cookie si se usa)
      * @param {*} token 
      * @returns 
      */
    async logout(token) {
        try {
            await UsersRepository.deleteRefreshToken(token)
            return { message: 'Logged out' };
        } catch (err) {
            return { error: err.message };
        }
    }
}

export default new AuthService();