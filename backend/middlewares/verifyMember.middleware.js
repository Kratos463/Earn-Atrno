const jwt = require("jsonwebtoken");
const Member = require("../models/member.model");

const extractTokenFromHeader = (authorizationHeader) => {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
        return null;
    }
    return authorizationHeader.split(" ")[1];
};

const VerifyMember = async (req, res, next) => {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: "Authorization failed: No token provided.", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const member = await Member.findById(decoded.id)

        if (!member) {
            return res.status(403).json({ error: "Access denied: User not found.", success: false });
        }

        req.member = member;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please log in again.", success: false });
        }
        return res.status(401).json({ error: "Authorization failed: Invalid token.", success: false });
    }
};

module.exports = VerifyMember;
