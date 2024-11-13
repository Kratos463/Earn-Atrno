"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";

const TopLeftIcons: React.FC = () => {
  const { member } = useAppSelector((state) => state.auth);

  const progress =
    member && member.currentLevelDetails
      ? ((member.wallet.coins % member.currentLevelDetails.maximumPoints) /
          member.currentLevelDetails.maximumPoints) *
        100
      : 0;

  return (
    <div className="absolute top-0 left-0 w-full p-2">
      <div className="flex items-center justify-between">
        <Link href="/game/leaderboard">
          <div className="px-3 py-1 bg-secondary/20 rounded-full text-white text-md md:text-lg lg:text-xl flex items-center space-x-1 h-8 md:h-10 lg:h-14">
            <Image
              src="/assets/Images/medal.png"
              alt="Leaderboard"
              className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
              width={20}
              height={20}
              quality={100}
            />
            <span className="text-xs md:text-sm lg:text-sm text-white font-medium">
              {member.firstName} (Director)
            </span>
          </div>
        </Link>

        {/* Level Section */}
        <div className="flex items-center w-1/3 justify-between px-3 py-1 bg-secondary/20 text-white text-md md:text-lg lg:text-xl rounded-full h-8 md:h-10 lg:h-14">
          {/* Left: Medal Image */}
          <div className="flex-shrink-0">
            <Image
              src="/assets/Images/character.png"
              alt="Character"
              className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
              width={20}
              height={20}
              quality={100}
            />
          </div>

          {/* Right: Level Details */}
          <div className="flex flex-col w-full ml-2 text-xs">
            {/* Name and Level */}
            <div className="flex justify-between">
              <p className="font-medium">
                {member?.currentLevelDetails?.name?.toUpperCase()}
              </p>
              <p>
                {member?.currentLevelDetails?.levelNumber}<span> / 15</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center mt-1">
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
    </div>
  );
};

export default TopLeftIcons;
