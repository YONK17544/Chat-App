import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// export const getUsersForSidebar = async (req, res) => {
//     try {
//       const loggedInUserId = req.user._id;
//       const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
//       res.status(200).json(filteredUsers);
//     } catch (error) {
//       console.error("Error in getUsersForSidebar: ", error.message);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user?._id;

        if (!loggedInUserId) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        if (!Array.isArray(filteredUsers)) {
            console.error("Unexpected response from database:", filteredUsers);
            return res.status(500).json({ error: "Failed to fetch users" });
        }

        console.log("Filtered Users:", filteredUsers); // Debug log
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try{
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json({messages});
    }catch(error){
        console.log("Could not fetch messages", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.log("Image upload failed:", uploadError.message);
                return res.status(400).json({ message: "Image upload failed. Please try again." });
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // Real-time functionality can go here with socket.io, if needed.

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage); // Wrap newMessage in a `data` field
    } catch (error) {
        console.log("Could not send message:", error.message);
        return res.status(500).json({ message: "Could not send message. Please try again later." });
    }
};