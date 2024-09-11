const Member = require("../models/member.model")

const fetchMembers = async (req, res) => {
    try {
        const members = await Member.find()
        if(!members){
            return res.status(400).json({message: "No members found", success: false})
        }

        return res.status(200).json({message: "Members list fetched successfully", success: true, members})
    } catch (error) {
        console.error("Error while fetching members list", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports ={fetchMembers}