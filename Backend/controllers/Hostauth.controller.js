import Host from "../Model/Host.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.helper.js";

// to signup as host
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const passwordHash = bcrypt.hashSync(password, 10);

        const host = await Host.create({
            name, email, password:passwordHash
        });

        const token = generateToken({ id: host._id })
        res.status(201).json({
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// login for host
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const host = await Host.findOne({ email });
        if (!host) {
            return res.status(404).json({ success: false, error: "Host not found" });
        }
        if (!host.password) {
            return res.status(401).json({ success: false, error: "Invalid host data: password hash missing" });
        }

        const isPasswordValid = await bcrypt.compare(password, host.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: "Invalid password" });
        }
        const token = generateToken({ id: host._id })
        res.status(200).json({
            success: true,
            host,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// to get details of the host
export const getMe = async (req, res) => {

    
    try {
        const host = await Host.findById(req.user.id);
        res.status(200).json({
            success: true,
            host
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


