# 🗨️ MERN One-on-One Chat App

A real-time one-on-one chat application built using the **MERN stack**, enhanced with **Socket.io**, **Tailwind CSS**, and **Cloudinary**. This app enables users stored in a MongoDB database to initiate private conversations in a sleek, theme-switchable interface.

---

## 🚀 Features

- 🔐 **User Authentication** with JWT
- 📞 **Real-time messaging** using Socket.io
- 📦 **MERN Stack** (MongoDB, Express, React, Node.js)
- 🧑‍🤝‍🧑 **One-on-one private chats**
- ☁️ **Cloudinary** for media/image storage
- 🌈 **32+ switchable themes** via TailwindCSS + Theme Engine
- 🧠 **Environment-configurable** for production-ready deployment

---

## 🛠️ Technologies Used

- **MongoDB** – NoSQL database for storing user and chat data
- **Express.js** – Backend framework
- **React.js** – Frontend framework with hooks
- **Node.js** – JavaScript runtime
- **Socket.io** – Real-time bi-directional communication
- **Tailwind CSS** – Utility-first CSS for UI design
- **Cloudinary** – Media/image storage and optimization
- **JWT** – Secure authentication via JSON Web Tokens

---

## 🌍 Environment Variables

Add a `.env` file at the root of the project with the following:

```env
MONGO_URI=your_mongo_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret
NODE_ENV=development # or 'production' in deployed environments

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
