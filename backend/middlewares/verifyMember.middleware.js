const Member = require("../models/member.model");

const VerifyMember = async (req, res, next) => {
    const { telegramId } = req.query;

    if (!telegramId) {
        return res.status(401).json({ error: "Authorization failed: No telegramId provided.", success: false });
    }

    try {
        const member = await Member.findOne({ telegramId });

        if (!member) {
            return res.status(403).json({ error: "Access denied: User not found.", success: false });
        }

        req.member = member;
        next();
    } catch (error) {
        console.error("Error verifying member:", error);
        return res.status(500).json({ error: "Internal server error.", success: false });
    }
};

module.exports = VerifyMember;
