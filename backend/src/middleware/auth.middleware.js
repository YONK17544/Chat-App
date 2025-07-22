import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

//middleware for authenticating users

export const protectRoute = async (req, res, next) => {

    try {
        // app.use(cookieParser()) needed in index.js for this to work
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: "Unauthorized- No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized- Invalid Token"});
        }

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Authentication Error", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}