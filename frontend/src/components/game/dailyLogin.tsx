"use client";

import React, { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/helper/convertNumber";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  fetchAllDailyLoginReward,
  claimTodayLoginReward,
} from "@/redux/dailyTaskSlice";
import { fetchCurrentMember } from "@/redux/authSlice";
import useLocalStorage from "@/helper/localStorage";
import Image from "next/image";

const ClaimDailyReward = () => {
  const tokenId = useLocalStorage("tokenId") || "";
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false); // State to handle loading

  // Destructuring the Redux state
  const { dailyLoginRewards } = useAppSelector((state) => state.dailyTask);
  const { member } = useAppSelector((state) => state.auth);

  // Fetch member and daily rewards if not already fetched
  useEffect(() => {
    if (!member && tokenId) {
      dispatch(fetchCurrentMember(tokenId));
    }
    if (dailyLoginRewards.length === 0) {
      dispatch(fetchAllDailyLoginReward());
    }
  }, [dispatch, member, dailyLoginRewards.length, tokenId]);

  // Memoize the next reward day calculation
  const nextRewardDay = useMemo(() => {
    return member?.dailyLoginStreak ? member.dailyLoginStreak + 1 : 1;
  }, [member]);

  // Memoize the logic to check if today is the reward day
  const isNextRewardDay = useMemo(() => {
    if (member?.currentDayRewardClaimed) {
      return false; // Reward already claimed today
    }
    return true; // Reward not claimed yet
  }, [member]);

  // Handle reward claiming
  const handleClaimReward = async () => {
    if (isNextRewardDay && !loading) { // Check if not already loading
      setLoading(true); // Set loading to true before claiming
      try {
        await dispatch(claimTodayLoginReward(tokenId)).unwrap();
        dispatch(fetchCurrentMember(tokenId));
      } catch (error) {
        console.error("Failed to claim reward", error);
      } finally {
        setLoading(false); // Reset loading state after the process is finished
      }
    }
  };

  return (
    <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
      <Image
        src="/assets/Images/gift.png"
        alt="Reward"
        className="mx-auto mb-4 w-20 h-20 shadow-2xl"
        width={50}
        height={50}
        quality={100}
      />
      <h1 className="text-2xl font-bold text-center">
        Claim Your Daily Login Reward
      </h1>
      <p className="text-center text-gray-300 mb-6 text-xs">
        Get coins for logging into the game without skipping. If you skip a day, you start all over again.
      </p>

      <div className="grid grid-cols-4 gap-2">
        {dailyLoginRewards.map((day) => {
          const isPastDay = day.day < nextRewardDay;
          const isToday = day.day === nextRewardDay && isNextRewardDay;
          const isLocked = day.day > nextRewardDay;

          return (
            <div
              key={day.day}
              className={`py-2 rounded-md flex flex-col items-center justify-center text-white font-bold text-center relative ${
                isToday ? "bg-blue" : "bg-gray-700"
              }`}
            >
              <p className="font-medium text-sm">Day {day.day}</p>
              <Image
                src="/assets/Images/star.png"
                alt="Reward"
                className="w-10 h-10 my-2"
                quality={100}
                width={20}
                height={20}
              />
              <p className="text-sm">{formatNumber(day.rewardValue)}</p>

              {isPastDay && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                  <Image
                    src="/assets/Images/green-tick.png"
                    alt="Claimed"
                    className="w-10 h-10 shadow-2xl"
                    quality={100}
                    width={20}
                    height={20}
                  />
                </div>
              )}

              {isLocked && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Image
                    src="/assets/Images/lock.png"
                    alt="Locked"
                    className="w-10 h-10 shadow-2xl"
                    quality={100}
                    width={20}
                    height={20}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className={`bg-secondary/50 rounded-md w-full mt-4 h-16 font-bold text-lg transition-opacity duration-300 ${
          isNextRewardDay && !loading ? "opacity-100" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!isNextRewardDay || loading}
        onClick={handleClaimReward}
      >
        {loading ? "Claiming..." : isNextRewardDay ? "Claim Reward" : "Come Back Tomorrow"}
      </button>
    </div>
  );
};

export default ClaimDailyReward;
