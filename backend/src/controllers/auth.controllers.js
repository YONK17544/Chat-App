import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//FUNCTIONS FOR AUTH CALLS

//FOR SIGN-UP
export const signup = async (req, res) => {
    //LOGIC FOR SIGN-UP
    const { fullName, email, password} = req.body;
    try{

        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        //hash the password
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }

        const user = await User.findOne({email});

        if(user) return res.status(400).json({message: "User already exists"});

        //HASHING THE PASSWORD OF THE USER
        //async function, so await is absolutely important
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            //generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                password: newUser.password,
                profilePic: newUser.profilePic,
            });
        }else{
            return res.status(400).json({message: "Invalid User Data"});
        }

    }catch(error){
        console.log("Error in signup", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//FOR LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email: email});

        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id, res);

        return res.status(200).json({message: "Logged in Successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    }catch(error){
        console.log("Error in login", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//FOR LOGOUT
export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({message: "Logged out Successfully"});

    }catch(error){
        console.log("Error in logout", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//FOR UPDATING PROFILE (RECHECK THIS IN ID SECTION AFTER MAKING FRONTEND UI)
export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile Picture is required"});
        }

        const uploadResponse =await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);

    }catch(error){
        console.log("Error in update profile", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//FOR CHECKING AUTHENTICATION
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}