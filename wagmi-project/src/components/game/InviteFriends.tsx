"use client"

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCopy, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const friends = [
    {
        id: 1,
        name: 'John Doe',
        image: '/assets/Images/character.png',
        level: 'Silver',
        totalCoins: 1500,
        earnedAmount: 50,
    },
    {
        id: 2,
        name: 'Jane Smith',
        image: '/assets/Images/character.png',
        level: 'Gold',
        totalCoins: 2500,
        earnedAmount: 100,
    },
    {
        id: 3,
        name: 'Bob Johnson',
        image: '/assets/Images/character.png',
        level: 'Diamond',
        totalCoins: 4000,
        earnedAmount: 200,
    },
    // Add more friends here
];

const referralCode = 'ABCD1234';

const InviteFriends: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="pb-16 p-4 text-white mx-auto max-w-[600px]">
            <img
                src="/assets/Images/users_group.png"
                alt="User"
                className="mx-auto mb-4 w-20 h-20 shadow-2xl"
            />

            {/* Heading */}
            <h1 className="text-2xl font-bold text-center mb-2">Invite Friends!</h1>

            {/* Description */}
            <p className="text-center text-gray-300 mb-6 text-xs">
                Share the joy of earning! Invite your friends and both of you will be rewarded with amazing bonuses.
            </p>

            {/* Invite a Friend Card */}
            <div className="bg-secondary/20 p-4 rounded-lg mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src='/assets/Images/gift.png'
                        alt='gift'
                        className="w-10 h-10 mr-4"
                    />
                    <div className="text-left">
                        <h3 className="text-sm font-medium">Invite a friend</h3>
                        <div className="flex items-center text-xs text-yellow-300 font-bold">
                            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                            +5000 <span className="text-white font-normal ml-1">for you and your friend</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Code Card */}
            <div className="bg-secondary/20 p-4 rounded-lg mb-6 flex items-center">
                <div className="flex items-center mr-4">
                    <img
                        src='/assets/Images/referral.png'
                        alt='users'
                        className="w-20 h-20 mr-4"
                    />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-left">Your Referral Code</h3>
                    <p className="text-gray-300 mb-4 text-xs text-left">
                        You and your friend will receive bonuses
                    </p>
                    <div className="flex items-center justify-center w-full bg-secondary/30 p-2 rounded-md">
                        <span className="text-lg text-yellow-300 font-bold font-mono">{referralCode}</span>
                        <button
                            onClick={handleCopyCode}
                            className="ml-2 p-1 bg-secondary rounded hover:bg-secondary/50 transition "
                        >
                            <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Friends List */}
            <div>
                <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">Your Friends</h2>
                <ul>
                    {friends.map((friend) => (
                        <li key={friend.id} className="mb-4 flex items-center justify-between p-2 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition">
                            <div className="flex items-center text-left">
                                <img
                                    src={friend.image}
                                    alt={friend.name}
                                    className="w-10 h-10 rounded-full mr-4 bg-primary/20 p-1"
                                />
                                <div className="flex-grow">
                                    <h3 className="text-sm font-semibold">{friend.name}</h3>
                                    <div className="text-xs text-gray-300">
                                        {friend.level} • <span className='text-yellow-300'>({friend.totalCoins}K)</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faDollarSign} className="text-yellow-300 mr-1" />
                                <span className="text-md font-bold text-yellow-300">{friend.earnedAmount}K</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InviteFriends;
