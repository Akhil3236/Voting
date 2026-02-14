import mongoose from "mongoose";

const HostSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
});

const Host = mongoose.model("Host", HostSchema);

export default Host;


