const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // adjust path/name to your User model
const { validationResult } = require('express-validator');

// /c:/Users/Ignacio-lopez/code/finanzas/controllers/auth.controller.js
'use strict';


const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

function signAccessToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_EXPIRES }
    );
}

function signRefreshToken(user) {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_EXPIRES }
    );
}

async function register(req, res) {
    try {
        // If you use express-validator in routes, check here
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed });
        await user.save();

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        // store refresh token server-side if desired (recommended)
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: 'User created',
            user: { id: user._id, name: user.name, email: user.email },
            accessToken
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

/**
 * Login user

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            message: 'Logged in',
            user: { id: user._id, name: user.name, email: user.email },
            accessToken
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

async function refreshToken(req, res) {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken || req.get('x-refresh-token');
        if (!token) return res.status(401).json({ message: 'No refresh token provided' });

        let payload;
        try {
            payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (e) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const user = await User.findById(payload.id);
        if (!user || user.refreshToken !== token) return res.status(401).json({ message: 'Invalid refresh token' });

        const accessToken = signAccessToken(user);
        const newRefresh = signRefreshToken(user);

        user.refreshToken = newRefresh;
        await user.save();

        res.cookie('refreshToken', newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}



async function getProfile(req, res) {
    try {
        
        const id = req.userId || req.user?.id;
        if (!id) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findById(id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json({ user });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}
*/
/** module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getProfile
};*/