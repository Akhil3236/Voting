
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4002;


app.use(express.json());

app.get("/", (req, res) => {

    res.status(200).json({
        sucess:true,
        message: "Server is running on port ${port}" });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});