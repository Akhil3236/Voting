
import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
    question: String,
    options: [
        {
            text: String,
            votes: { type: Number, default: 0 }
        }
    ],
    voters: [
        {
            ip: String,
            deviceId: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Host"
    }
});

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;

