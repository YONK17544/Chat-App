//UTILITY FUNCTINS KEPT HERE
import dotenv from "dotenv";
dotenv.config();

//GENERATING A TOKEN FOR JWT
import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) =>{
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 60 * 60 * 24 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development'
    })
}