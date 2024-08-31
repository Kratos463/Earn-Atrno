const redisClient = require("../utils/redisConnect.js")
const Member = require('../models/member.model.js');

// Function to increment coin count in Redis by a specific value
async function incrementCoin(memberId, incrementValue) {
    try {
        const redisKey = `member:${memberId}:coin`;

        // Ensure incrementValue is a string
        const newCoinCount = await redisClient.sendCommand(['INCRBY', redisKey, incrementValue.toString()]);

        return newCoinCount;
    } catch (error) {
        console.error('Error incrementing coin in Redis:', error);
        throw error;
    }
}


// API Endpoint to handle coin tap with variable increment values
const tapCoin = async (req, res) => {
    const memberId = req.member._id;

    if (!memberId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(400).json({ message: 'Member not found', success: false });
        }

        const incrementPoint = member.powerUps.onTap;
        const newCoinCount = await incrementCoin(memberId, incrementPoint);

        return res.status(200).json({ success: true, newCoinCount });
    } catch (error) {
        console.error('Error handling coin tap:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function syncCoinsToMongo() {
    try {
        // Use sendCommand to get all keys that match the pattern
        const keys = await redisClient.sendCommand(['KEYS', 'member:*:coin']);

        if (keys.length === 0) {
            console.log('No coins to synchronize from Redis to MongoDB.');
            return;
        }

        for (const key of keys) {
            const memberId = key.split(':')[1];
            
            // Use sendCommand to get the coin count value
            const coinCount = await redisClient.sendCommand(['GET', key]);

            if (coinCount) { 
                const member = await Member.findById(memberId);
                if (member) {
                    // Calculate the new coin count
                    const newCoinCount = (member.wallet.coins || 0) + parseInt(coinCount, 10);

                    // Update the new coin count in MongoDB
                    await Member.findByIdAndUpdate(memberId, { 'wallet.coins': newCoinCount });

                    // Optionally reset the coin count in Redis after syncing
                    await redisClient.sendCommand(['DEL', key]);
                } else {
                    console.warn(`No member found with ID ${memberId}`);
                }
            } else {
                console.warn(`No coin count found in Redis for member ID ${memberId}`);
            }
        }

        console.log('Coins synchronized from Redis to MongoDB.');
    } catch (error) {
        console.error('Error synchronizing coins to MongoDB:', error);
    }
}

// setInterval(syncCoinsToMongo, 40000);


module.exports = { tapCoin };
