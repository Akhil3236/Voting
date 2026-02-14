import { verifyToken } from "../utils/jwt.helper.js";


export const hostauthmiddleware = (req, res, next) => {
    try {
        // take token form the bearer
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



