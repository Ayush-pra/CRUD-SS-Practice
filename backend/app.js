require("dotenv").config();
const express = require("express");
const pool = require("./config/db");
const cookieParser = require("cookie-parser");
const userModel = require("./config/userModel");
const postModel = require("./config/postModel");
const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const initDb = async()=>{
    try{
        await userModel.createUserTable();
        await postModel.createPostTable();
        console.log("Tables initialized successfully ✅");
    }
    catch(err){
        console.log("Error initializing tables:", err);
    }
}
const startServer = async()=>{
    try{
        await initDb(); 
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    }
    catch(err){
        console.log("Error starting server:", err);
    }   
};

startServer();