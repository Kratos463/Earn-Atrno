const Member = require("../models/member.model")


const fetchMembers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10

        const members = await Member.find()
            .select("_id userId referralCode referredBy accountStatus createdAt country wallet.coins")
            .skip((page - 1) * limit) // Skip the members of previous pages
            .limit(Number(limit));    // Limit the number of members per page

        const totalMembers = await Member.countDocuments();

        if (!members.length) {
            return res.status(400).json({ message: "No members found", success: false });
        }

        return res.status(200).json({
            message: "Members list fetched successfully",
            success: true,
            members,
            pagination: {
                totalPages: Math.ceil(totalMembers / limit), 
            currentPage: Number(page), 
            totalMembers, 
            }
        });
    } catch (error) {
        console.error("Error while fetching members list", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


module.exports ={fetchMembers}