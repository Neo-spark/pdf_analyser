const mongoose = require('mongoose');

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const register = async (req, res) =>
{
    const { name, email, password } = req.body;

    if (!name || !email || !password)
    {
        return res.status(400).json({
            message: "Please fill all the fields"
        });
    }

    try
    {
        const user = await User.findOne({ email });

        if (user)
        {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newuser.save();

        res.status(201).json({
            message: "User registered successfully"
        });
    }
    catch (error)
    {
        res.status(500).json({
            message: "Error occurred while registering user"
        });
    }
};



// generate access token
const generateAccessToken = (user) =>
{
    const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    return accessToken;
};



// generate refresh token
const generateRefreshToken = (user) =>
{
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return refreshToken;
};



const login = async (req, res) =>
{
    const { email, password } = req.body;

    if (!email || !password)
    {
        return res.status(400).json({
            message: "Please fill all the fields"
        });
    }

    try
    {
        const user = await User.findOne({ email });

        if (!user)
        {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
        {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;

        await user.save();

        // Store refresh token in HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "lax",
            path: "/auth"
        });

        // Send only access token to frontend
        return res.status(200).json({
            accessToken
        });
    }
    catch (error)
    {
        return res.status(500).json({
            message: "Error occurred while logging in"
        });
    }
};



// refresh token
const refreshToken = async (req, res) =>
{
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
    {
        return res.status(401).json({
            message: "No refresh token provided"
        });
    }

    try
    {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findOne({
            _id: decoded.id,
            refreshToken: refreshToken
        });

        if (!user)
        {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            accessToken: newAccessToken
        });
    }
    catch (error)
    {
        return res.status(403).json({
            message: "Invalid or expired refresh token"
        });
    }
};



// logout user
const logoutUser = async (req, res) =>
{
    try
    {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken)
        {
            const user = await User.findOne({
                refreshToken
            });

            if (user)
            {
                user.refreshToken = undefined;

                await user.save();
            }
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/auth"
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });
    }
    catch (error)
    {
        return res.status(500).json({
            message: "Logout failed"
        });
    }
};



module.exports = {
    register,
    login,
    refreshToken,
    logoutUser
};