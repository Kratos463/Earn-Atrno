"use client"

import React from 'react';
import Link from 'next/link';
import {useAppSelector} from '@/redux/store'


const TopLeftIcons: React.FC = () => {

    const {member}= useAppSelector((state)=> state.auth)

    return (
        <div className="absolute top-0 left-0 w-full p-2">
            {/* Container for the icons and wallet address */}
            <div className="flex items-center justify-between">
                {/* Left Section: Medal and Level */}
                <div className="flex items-center space-x-1">
                    <Link href="/game/leaderboard">
                        <div className="flex items-center space-x-2 text-white p-1 bg-secondary/20 rounded-full h-8 md:h-10 lg:h-14">
                            <img
                                src='/assets/Images/medal.png'
                                alt="Leaderboard"
                                className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                            />
                        </div>
                    </Link>

                    {/* Level Section */}
                    <div className="flex flex-col justify-center py-1 px-4 bg-secondary/20 text-white rounded-full h-8 md:h-10 lg:h-14 w-32 md:w-40 lg:w-48">
                        <div className="text-xs md:text-xs lg:text-xs text-left">Level {member?.curretLevelDetails?.levelNumber}/11</div>
                        <div className="w-full bg-secondary/30 rounded-full h-1.5 mt-1">
                            <div
                                className="bg-secondary h-1.5 rounded-full"
                                style={{ width: '40%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Wallet Icon and Address */}
                <div className="flex items-center space-x-1 py-1 px-3 bg-secondary/20 rounded-full h-8 md:h-10 lg:h-14">
                    <img
                        src='/assets/Images/wallet.png'
                        alt="Wallet"
                        className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                    />
                    <span className="text-xs md:text-sm lg:text-sm text-white">0x1234...abcd</span> {/* Replace with actual address */}
                </div>
            </div>
        </div>
    );
};

export default TopLeftIcons;
