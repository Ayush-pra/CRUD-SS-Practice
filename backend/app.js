require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userModel = require("./config/userModel");
const postModel = require("./config/postModel");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

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