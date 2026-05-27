import jwt from 'jsonwebtoken';

/**
 * - generateAccessToken: genera token de acceso
 * - generateRefreshToken: genera token de refresco
 */
const generateAccessToken = (user) =>{
    return jwt.sign(
        {id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const generateRefreshToken = (user)=>{
    return jwt.sign(
        {id: user.id },
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
};

export {
    generateAccessToken,
    generateRefreshToken
}