"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { useAccount } from 'wagmi';
import { resetAuthState } from '@/redux/authSlice';
import { useRouter } from "next/navigation";

const TopLeftIcons: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { member } = useAppSelector((state) => state.auth);
    const { isConnected } = useAccount(); // Wagmi hook to track connection status

    useEffect(() => {
        if (!isConnected) {
            // If the wallet is disconnected, handle logout logic here
            dispatch(resetAuthState()); // Reset auth state in Redux
            localStorage.removeItem('token');
            router.push("/auth/signin");
        }
    }, [isConnected, dispatch]);

    // Calculate progress dynamically
    const progress = member && member.currentLevelDetails 
        ? (member.wallet.coins % member.currentLevelDetails.maximumPoints) / member.currentLevelDetails.maximumPoints * 100
        : 0;

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
                    <div className="flex flex-col w-32 justify-center py-1 px-4 bg-secondary/20 text-white rounded-full h-8 md:h-10 lg:h-14">
                        <div className="w-full">
                            <div className="flex justify-between">
                                <p className="text-xs">{member?.currentLevelDetails?.name}</p>
                                <p className="text-xs">{member?.currentLevelDetails?.levelNumber}<span className="text-[#95908a]">/ 11</span></p>
                            </div>
                            <div className="flex items-center border-2 border-[#43433b] rounded-full">
                                <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                                    <div 
                                        className="progress-gradient h-2 rounded-full" 
                                        style={{ width: `${progress}%` }} 
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Web3Modal Account Button on the right */}
                <div className="flex items-center">
                    <w3m-account-button balance="hide" />
                </div>
            </div>
        </div>
    );
};

export default TopLeftIcons;
