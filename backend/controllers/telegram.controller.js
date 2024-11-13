// controllers/telegramController.js
const axios = require('axios');
const Member = require('../models/member.model');
const jwt = require("jsonwebtoken");
const Level = require('../models/level.model');
const TelegramBot = require('node-telegram-bot-api');
const { EnergyBoost, MultitapBoost } = require('../models/boost.model');
require('dotenv').config();


// Initialize the bot with your Telegram bot token
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

const registrationError = 'Oops! There was an issue registering you. Please try again in a little while. We apologize for the inconvenience.';
const genericError = 'An unexpected error occurred. Please try again later.';



const generateUniqueReferralCode = async () => {
    const generateCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let referralCode = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            referralCode += characters[randomIndex];
        }
        return referralCode;
    };

    let referralCode;
    do {
        referralCode = generateCode();
    } while (await Member.exists({ referralCode }));

    return referralCode;
};

const handleReferralReward = async (referredByUser) => {
    if (referredByUser) {
        referredByUser.wallet.coins += 2500;
        await referredByUser.save();
    }
};

const handleWebhooks = async (req, res) => {
    const { message } = req.body;

    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        if (text && text.startsWith('/start')) {
            // Match and extract referral code if available
            await handleStartCommand(message, text);
        } else {
            // Handle other messages or commands (fallback for unknown commands)
            await bot.sendMessage(chatId, "Unknown command. Try /start.");
        }
    }

    res.status(200).send();
};

const handleStartCommand = async (msg, text) => {
    const chatId = msg.chat.id;
    const match = text.match(/\/start\?startapp=(.+)/);
    const referralCode = match && match[1] ? match[1].trim() : null;

    // Extract user data from the message
    const telegramData = {
        telegramId: msg.from.id,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        language_code: msg.from.language_code,
    };

    try {
        const existingUser = await Member.findOne({ telegramId: telegramData.telegramId });

        if (existingUser) {
            await sendSuccessMessage(existingUser, chatId)
        } else {
            // New user registration
            const initialCoin = 2500;

            const level = await Level.findOne({
                minimumPoints: { $lte: initialCoin },
                maximumPoints: { $gte: initialCoin }
            }).exec();

            if (!level) {
                return res.status(400).json({ message: "No suitable level found.", success: false });
            }

            // If the referral code exists, find the referring user
            const referredByUser = referralCode ? await Member.findOne({ referralCode }).exec() : null;

            // Calculate any rewards from cleared levels based on initial coins
            const clearedLevels = await Level.find({ maximumPoints: { $lte: initialCoin } }).exec();
            const totalPowerUps = clearedLevels.reduce((acc, level) => {
                acc.onTap += level.powerUps.onTap || 0;
                acc.energy += level.powerUps.energy || 0;
                return acc;
            }, { onTap: 0, energy: 0 });

            const energyLevel = await EnergyBoost.findOne().sort({ _id: 1 });
            const tapLevel = await MultitapBoost.findOne().sort({ _id: 1 });

            const newUser = new Member({
                telegramId: telegramData.telegramId,
                firstName: telegramData.firstName,
                lastName: telegramData.lastName,
                referralCode: await generateUniqueReferralCode(),
                referredBy: referredByUser ? referredByUser._id : null,
                country: telegramData.language_code,
                currentLevel: {
                    levelId: level._id,
                    levelNumber: level.levelNumber
                },
                levelCleared: clearedLevels.map(l => ({ levelId: l._id, levelNumber: l.levelNumber })),
                dailyLoginStreak: 0,
                lastLoginDate: new Date(),
                currentDayRewardClaimed: false,
                nextDayRewardDate: new Date(),
                wallet: { coins: initialCoin + clearedLevels.reduce((acc, level) => acc + level.reward, 0) },
                accountStatus: "Active",
                tapLevel: tapLevel._id,
                energyLevel: energyLevel._id,
                powerUps: {
                    onTap: totalPowerUps.onTap,
                    energy: totalPowerUps.energy
                },
                nextUpcomingLevel: {
                    levelId: null,
                    levelNumber: level.levelNumber + 1
                }
            });

            await newUser.save();

            const nextLevel = await Level.findOne({ levelNumber: newUser.currentLevel.levelNumber + 1 }).exec();
            if (nextLevel) {
                newUser.nextUpcomingLevel.levelId = nextLevel._id;
                await newUser.save();
            }


            if (referralCode) {
                await handleReferralReward(referredByUser);
            }

            await sendSuccessMessage(newUser, chatId)
        }
    } catch (error) {
        // Handle error response
        if (error.response) {
            bot.sendMessage(chatId, registrationError);
        } else {
            bot.sendMessage(chatId, genericError);
        }
    }
};

const sendSuccessMessage = async (user, chatId) => {
    const inlineKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Play Now 🎮", web_app: { url: `https://atrnoarena.aeternus.foundation?telegramId=${user.telegramId}` } },
                ],
                [
                    { text: "Subscribe to YouTube", url: "https://www.youtube.com/@aeternusfoundation" },
                    { text: "Follow on X", url: "https://x.com/AeternusF" }
                ]
            ]
        }
    };

    const successMessage = `🚀 Hello, ${user.firstName}! Welcome to Atrno Arena! 🐹

🎉 You are now the **Director** of your very own crypto exchange! Get ready to dive into the world of crypto and lead your exchange to success. 🏆

💰 Exciting news: We're preparing a **special Air Drop event**, and your contributions will be greatly appreciated when it launches. Stay tuned for your chance to claim exclusive rewards!

🌟 Don't forget, teamwork pays off! Invite your friends to join you in Atrno Arena, and together you'll unlock **even more coins** and rewards. The more, the merrier! 🎮💎

Let's build something great together! 💪`;

    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: successMessage,
        parse_mode: "Markdown",
        ...inlineKeyboard
    });
};

const setTelegramWebhook = async () => {
    try {
        const url = `${process.env.BASE_URL}/api/v1/telegram/webhook`;
        const response = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/setWebhook`, {
            url
        });
    } catch (error) {
        console.error('Error setting Telegram webhook:', error);
    }
};


module.exports = { handleWebhooks, setTelegramWebhook };
