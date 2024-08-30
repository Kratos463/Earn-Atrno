import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const levels = [
    {
        id: 1, name: 'Bronze', image: '/assets/Images/character.png', pointsRequired: 100, users: [
            { name: 'Alice', image: '/assets/Images/men.jpg', points: 1200, rank: 1 },
            { name: 'Bob', image: '/assets/Images/women.jpg', points: 1100, rank: 2 },
            { name: 'Charlie', image: '/assets/Images/men.jpg', points: 1000, rank: 3 },
            { name: 'Alice', image: '/assets/Images/men.jpg', points: 1200, rank: 4 },
            { name: 'Bob', image: '/assets/Images/women.jpg', points: 1100, rank: 5 },
            { name: 'Charlie', image: '/assets/Images/men.jpg', points: 1000, rank: 6 },
        ]
    },
    {
        id: 2, name: 'Silver', image: '/assets/Images/character.png', pointsRequired: 150, users: [
            { name: 'David', image: '/assets/Images/women.jpg', points: 1500, rank: 1 },
            { name: 'Eva', image: '/assets/Images/men.jpg', points: 1400, rank: 2 },
            { name: 'Frank', image: '/assets/Images/men.jpg', points: 1300, rank: 3 },
        ]
    },
    {
        id: 3, name: 'Gold', image: '/assets/Images/character.png', pointsRequired: 200, users: [
            { name: 'Grace', image: '/assets/Images/men.jpg', points: 2000, rank: 1 },
            { name: 'Hank', image: '/assets/Images/character.png', points: 1900, rank: 2 },
            { name: 'Ivy', image: '/assets/Images/women.png', points: 1800, rank: 3 },
        ]
    },
    {
        id: 4, name: 'Platinum', image: '/assets/Images/character.png', pointsRequired: 250, users: [
            { name: 'Jack', image: '/assets/Images/user10.png', points: 2500, rank: 1 },
            { name: 'Laura', image: '/assets/Images/user11.png', points: 2400, rank: 2 },
            { name: 'Mike', image: '/assets/Images/user12.png', points: 2300, rank: 3 },
        ]
    },
    // Add more levels as needed
];

const LeaderboardList: React.FC = () => {
    const [currentLevel, setCurrentLevel] = useState<number>(0);

    const handlePreviousLevel = () => {
        setCurrentLevel((prev) => (prev > 0 ? prev - 1 : levels.length - 1));
    };

    const handleNextLevel = () => {
        setCurrentLevel((prev) => (prev < levels.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="pb-16 p-4 text-white mx-auto w-full max-w-[600px]">
            <div className="flex flex-col items-center mb-6">
                <img
                    src={levels[currentLevel].image}
                    alt={levels[currentLevel].name}
                    className="w-32 h-32 rounded-lg mb-4"
                />
                <div className="flex items-center">
                    <button
                        onClick={handlePreviousLevel}
                        className="text-secondary mx-2 p-2 rounded-full transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span className="text-lg font-semibold">
                        Level {levels[currentLevel].name}
                    </span>
                    <button
                        onClick={handleNextLevel}
                        className="text-secondary mx-2 p-2 rounded-full transition"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
                <div className="text-gray-300 text-sm mb-2">
                    {levels[currentLevel].users[0].points}K / {levels[currentLevel].pointsRequired}M
                </div>
            </div>

            {/* Leaderboard Table */}
            <div>
                <ul>
                    {levels[currentLevel].users.map((user, index) => (
                        <li key={index} className="mb-4 flex items-center justify-between p-1 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition">
                            <div className="flex items-center">
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full mr-4 bg-primary/20 p-1"
                                />
                                <div className="flex-grow text-left">
                                    <h3 className="text-sm font-semibold">{user.name}</h3>
                                    <div className="text-xs text-gray-300">
                                        <FontAwesomeIcon icon={faDollarSign} className="text-yellow-300 mr-1" />{user.points}
                                    </div>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-gray-300 mr-2">{user.rank}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LeaderboardList;
