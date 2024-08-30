"use client"

import React, { useState } from 'react';
import TopLeftIcons from './topLeftIcons';

const TapOnCoinCounter: React.FC = () => {
    const [count, setCount] = useState<number>(2);
    const [energy, setEnergy] = useState<number>(800); // Initial energy value

    const handleCoinClick = () => {
        if (count < 600) {
            setCount(count + 1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 relative bg-dark">
            {/* Top Left Icons */}
            <TopLeftIcons />

            {/* Total Coins Display */}
            <div className="mb-4 text-white text-3xl md:text-4xl lg:text-5xl flex items-center justify-center space-x-2">
                <img
                    src='/assets/images/dollar.png'
                    alt="Dollar"
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                />
                <span className='font-bold text-white'>{count.toLocaleString()}</span>
            </div>

            {/* Coin Image */}
            <div className="relative flex flex-col items-center mb-4">
                <div
                    className="cursor-pointer rounded-full border-8 border-secondary hover:border-secondary-400 transition-all shadow-inner p-1"
                    onClick={handleCoinClick}
                    style={{
                        background: 'linear-gradient(135deg, #1c002b, #e8a3ff)',
                        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 2px 8px',
                    }}
                >
                    <img
                        src='/assets/images/character.png'
                        alt="Aeternus coin"
                        className="w-56 h-56 md:w-52 md:h-52 lg:w-56 lg:h-56 rounded-full"
                    />
                </div>
            </div>

            {/* Energy Display */}
            <div className="absolute bottom-20 left-2 px-3 py-1 bg-secondary/20 rounded-full text-white text-md md:text-lg lg:text-xl flex items-center space-x-1 h-8 md:h-10 lg:h-14">
                <img
                    src="/assets/Images/flash.png"
                    alt="Energy"
                    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                />
                <span className="text-xs md:text-sm lg:text-sm text-white font-medium">{energy}/3000</span>
                <div className="w-full bg-gray-500 rounded-full h-1.5 mt-1">
                    <div
                        className="bg-yellow-400 h-1.5 rounded-full"
                        style={{ width: '40%' }}
                    ></div>
                </div>
            </div>
        </div >
    );
};

export default TapOnCoinCounter;
