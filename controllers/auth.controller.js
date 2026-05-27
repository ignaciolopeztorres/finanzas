import authService from "../services/auth.service.js";

class authController {
    constructor(){}
    
    /**
     * Controlador para registro
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async register(req, res) {
        try {
            const { name, username, email, password } = req.body;
            const new_User = await authService.register(username, name, email, password);

            if (new_User) {
                console.log(new_User)
            }

            res.json({new_User: new_User});
        } catch (err) {
            return res.status(400).json({ message: 'Server error', error: err.message });
        }
    }
    /**
     * login controller
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async login(req, res){
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new Error("Usiario o contraseña no son validos");
            }
            const token = await authService.login(req.body.email, req.body.password);
            res.status(200).json({message: 'Login Exitoso!!!', accessToken: token.accessToken, refreshToken: token.refreshToken});
        } catch (error) {
            return res.status(400).json({ message: 'Server error: ', error: error.message });
        }
    }

    async refresh(req, res){
        try {
            const { token } = req.body;
            const newToken = await authService.refresh(token);
            res.json({accessToken: newToken.accessToken, refreshToken: newToken.refreshToken});
        } catch (error) {
            res.status(403).json({error: error.message});
        }
    }

    async logout(req, res) {
        try {
            const { token } = req.body;
            await authService.logout(token);
            res.json({message: 'logout Exitoso!!!'});
        } catch (error) {
            res.status(403).json({error: error.message});
        }
    }
}

export default new authController();