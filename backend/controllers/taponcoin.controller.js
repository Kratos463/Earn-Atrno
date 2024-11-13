const Level = require("../models/level.model.js");
const Member = require("../models/member.model.js");
const redisClient = require("../utils/redisConnect.js"); // Assuming you're importing your Redis client

// Function to increment coin count in Redis by a specific value
async function incrementCoin(memberId, incrementValue) {
    try {
        const redisKey = `member:${memberId}:coin`;

        const newCoinCount = await redisClient.sendCommand(['INCRBY', redisKey, incrementValue.toString()]);

        return newCoinCount;
    } catch (error) {
        console.error('Error incrementing coin in Redis:', error);
        throw error; 
    }
}

// API Endpoint to handle coin tap with variable increment values from frontend
const tapCoin = async (req, res) => {
    const member = req.member;
    const { incrementPoint } = req.body;

    try {
        const newCoinCount = await incrementCoin(member._id, incrementPoint);

        return res.status(200).json({ success: true, newCoinCount });
    } catch (error) {
        console.error('Error handling coin tap:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function syncCoinsToMongo() {
    try {
        const keys = await redisClient.sendCommand(['KEYS', 'member:*:coin']);

        if (keys.length === 0) {
            return;
        }

        const allLevels = await Level.find({});
        const levelMap = {};
        allLevels.forEach(level => {
            levelMap[level.minimumPoints] = level;
        });

        for (const key of keys) {
            const memberId = key.split(':')[1];
            const coinCount = await redisClient.sendCommand(['GET', key]);

            if (coinCount) {
                const member = await Member.findById(memberId);
                if (member) {
                    const newCoinCountFromRedis = parseInt(coinCount, 10);

                    // Find the current level based on member's current level maximum points
                    const currentLevel = allLevels.find(level => level._id.equals(member.currentLevel.levelId));
                    const nextLevel = allLevels.find(level => level.minimumPoints > newCoinCountFromRedis);

                    if (currentLevel) {
                        // Get all levels that can be cleared
                        const clearedLevels = allLevels.filter(level => level.maximumPoints <= newCoinCountFromRedis);
                        
                        // Remove duplicates for levelCleared
                        const clearedLevelIds = new Set(member.levelCleared.map(level => level.levelId.toString()));

                        // Only add new cleared levels that aren't already in the member's levelCleared array
                        const newClearedLevels = clearedLevels.filter(level => !clearedLevelIds.has(level._id.toString()));

                        const totalPowerUps = clearedLevels.reduce((acc, level) => {
                            acc.onTap += level.powerUps.onTap || 0;
                            acc.energy += level.powerUps.energy || 0;
                            return acc;
                        }, { onTap: 0, energy: 0 });

                        // Check if the member's current level is less than the new level
                        if (currentLevel.maximumPoints < newCoinCountFromRedis) {
                            const newLevel = allLevels.find(level => level.maximumPoints >= newCoinCountFromRedis);
                            if (newLevel) {
                                await Member.findByIdAndUpdate(memberId, {
                                    'wallet.coins': newCoinCountFromRedis,
                                    'currentLevel.levelId': newLevel._id,
                                    'currentLevel.levelNumber': newLevel.levelNumber,
                                    // Use $addToSet to avoid duplicates in the cleared levels
                                    $addToSet: {
                                        levelCleared: { $each: newClearedLevels.map(l => ({ levelId: l._id, levelNumber: l.levelNumber })) },
                                    },
                                    'nextUpcomingLevel.levelId': nextLevel ? nextLevel._id : null,
                                    'nextUpcomingLevel.levelNumber': nextLevel ? nextLevel.levelNumber : null,
                                    'powerUps.onTap': totalPowerUps.onTap,
                                    'powerUps.energy': totalPowerUps.energy,
                                }, { new: true });

                                await redisClient.set(`member:${memberId}`, JSON.stringify({
                                    ...member.toObject(),
                                    wallet: { coins: newCoinCountFromRedis },
                                    currentLevel: { levelId: newLevel._id, levelNumber: newLevel.levelNumber },
                                    levelCleared: [...member.levelCleared, ...newClearedLevels.map(l => ({ levelId: l._id, levelNumber: l.levelNumber }))],
                                    nextUpcomingLevel: {
                                        levelId: nextLevel ? nextLevel._id : null,
                                        levelNumber: nextLevel ? nextLevel.levelNumber : null
                                    }
                                }));
                                await redisClient.sendCommand(['DEL', key]);

                                console.log(`Member ${memberId} updated with ${newCoinCountFromRedis} coins and level ${newLevel.name}`);
                            }
                        } else {
                            await Member.findByIdAndUpdate(memberId, {
                                'wallet.coins': newCoinCountFromRedis,
                                'nextUpcomingLevel.levelId': nextLevel ? nextLevel._id : null,
                                'nextUpcomingLevel.levelNumber': nextLevel ? nextLevel.levelNumber : null,
                                'powerUps.onTap': totalPowerUps.onTap,
                                'powerUps.energy': totalPowerUps.energy,
                            }, { new: true });
                            await redisClient.sendCommand(['DEL', key]);
                            console.log(`Member ${memberId} updated with ${newCoinCountFromRedis} coins`);
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
    } catch (error) {
        console.error('Error synchronizing coins and levels to MongoDB:', error);
    }
}


setInterval(syncCoinsToMongo, 1000);

module.exports = { tapCoin };
