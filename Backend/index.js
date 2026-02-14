import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import HostauthRoute from "./routes/Hostauth.route.js";
import PollRoute from "./routes/poll.host.route.js";
import PublicPollRoute from "./routes/poll.public.route.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust this in production
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

// Socket.io connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Pass io to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: `Server is running on port ${port}`
    });
});

// database connection
connectDB();

app.use("/api/host", HostauthRoute);
app.use("/api/poll", PollRoute);
app.use("/api/public/poll", PublicPollRoute);

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});