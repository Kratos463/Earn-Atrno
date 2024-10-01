const Level = require("../models/level.model.js");
const Member = require("../models/member.model.js");
const redisClient = require("../utils/redisConnect.js"); // Assuming you're importing your Redis client

// Function to increment coin count in Redis by a specific value
async function incrementCoin(memberId, incrementValue) {
    try {
        const redisKey = `member:${memberId}:coin`;

        // Perform the Redis INCRBY operation using sendCommand
        const newCoinCount = await redisClient.sendCommand(['INCRBY', redisKey, incrementValue.toString()]);

        return newCoinCount; // Return the new coin count
    } catch (error) {
        console.error('Error incrementing coin in Redis:', error);
        throw error; // Throw the error to handle it in the calling function
    }
}

// API Endpoint to handle coin tap with variable increment values from frontend
const tapCoin = async (req, res) => {
    const memberId = req.member._id;
    const { incrementPoint } = req.body;

    // Validation for memberId and incrementPoint
    if (!memberId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(400).json({ message: 'Member not found', success: false });
        }

        const newCoinCount = await incrementCoin(memberId, incrementPoint);

        return res.status(200).json({ success: true, newCoinCount });
    } catch (error) {
        console.error('Error handling coin tap:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to synchronize coins from Redis to MongoDB periodically
async function syncCoinsToMongo() {
    try {
        const keys = await redisClient.sendCommand(['KEYS', 'member:*:coin']);

        if (keys.length === 0) {
            console.log('No coins to synchronize from Redis to MongoDB.');
            return;
        }

        for (const key of keys) {
            const memberId = key.split(':')[1];
            const coinCount = await redisClient.sendCommand(['GET', key]);

            if (coinCount) {
                const member = await Member.findById(memberId);
                if (member) {
                    const newCoinCountFromRedis = parseInt(coinCount, 10);
                    const newLevel = await Level.findOne({ minimumPoints: { $lte: newCoinCountFromRedis } }).sort({ minimumPoints: -1 });

                    if (newLevel) {
                        const updateResult = await Member.findByIdAndUpdate(memberId, {
                            'wallet.coins': newCoinCountFromRedis,
                            'currentLevel.levelId': newLevel._id,
                            'currentLevel.levelNumber': newLevel.levelNumber
                        });

                        if (updateResult) {
                            await redisClient.set(`member:${memberId}`, JSON.stringify({
                                ...member.toObject(),
                                wallet: { coins: newCoinCountFromRedis },
                                currentLevel: { levelId: newLevel._id, levelNumber: newLevel.levelNumber }
                            }));
                            await redisClient.sendCommand(['DEL', key]);

                            console.log(`Member ${memberId} updated with ${newCoinCountFromRedis} coins and level ${newLevel.name}`);
                        } else {
                            console.error(`Failed to update member ${memberId} in MongoDB.`);
                        }
                    } else {
                        console.warn(`No level found for total coins: ${newCoinCountFromRedis}`);
                    }
                } else {
                    console.warn(`No member found with ID ${memberId}`);
                }
            } else {
                console.warn(`No coin count found in Redis for member ID ${memberId}`);
            }
        }

        console.log('Coins and levels synchronized from Redis to MongoDB.');
    } catch (error) {
        console.error('Error synchronizing coins and levels to MongoDB:', error);
    }
}


// Set an interval to synchronize coins to MongoDB every 1000 ms (1 second)
setInterval(syncCoinsToMongo, 1000);

module.exports = { tapCoin };
