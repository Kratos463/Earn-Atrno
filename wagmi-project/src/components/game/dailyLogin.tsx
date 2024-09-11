"use client";

import React, { useEffect } from "react";
import { formatNumber } from "@/helper/convertNumber";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchAllDailyLoginReward, claimTodayLoginReward } from "@/redux/dailyTaskSlice";
import { fetchCurrentMember } from "@/redux/authSlice";

const ClaimDailyReward = () => {
    const dispatch = useAppDispatch();
    const { dailyLoginRewards } = useAppSelector((state) => state.dailyTask);
    const { member } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCurrentMember());
        dispatch(fetchAllDailyLoginReward());
    }, [dispatch]);

    // Helper function to get the next reward day based on the current streak
    const getNextRewardDay = () => {
        if (member?.dailyLoginStreak != null) {
            return member.dailyLoginStreak + 1;
        }
        return null;
    };

    // Helper function to check if today is the next day for reward
    const isNextRewardDay = () => {
        if (member?.nextDayRewardDate) {
            const nextRewardDate = new Date(member.nextDayRewardDate);
            const today = new Date();
            // Remove the time part for comparison
            nextRewardDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            return today.getTime() === nextRewardDate.getTime();
        }
        return false;
    };

    // Determine the next reward day
    const nextRewardDay = getNextRewardDay() || 0;

    // Handler for claiming the daily reward
    const handleClaimReward = () => {
        if (isNextRewardDay()) {
            dispatch(claimTodayLoginReward())
                .unwrap()
                .then((response) => {
                    dispatch(fetchCurrentMember());
                })
                .catch((error) => {
                    console.error("Failed to claim reward", error);
                });
        }
    };

    return (
        <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
            <img
                src="/assets/Images/gift.png"
                alt="User"
                className="mx-auto mb-4 w-20 h-20 shadow-2xl"
            />
            <h1 className="text-2xl font-bold text-center">Claim Your Daily Login Reward</h1>
            <p className="text-center text-gray-300 mb-6 text-xs">
                Get coins for logging into the game without skipping. If you skip a day, you start all over again.
            </p>

            <div className="grid grid-cols-4 gap-2">
                {dailyLoginRewards?.map((day) => {
                    const isPastDay = day.day < nextRewardDay;
                    const isToday = day.day === nextRewardDay && isNextRewardDay();
                    const isLocked = day.day > nextRewardDay;

                    return (
                        <div
                            key={day.day}
                            className={`py-2 rounded-md flex flex-col items-center justify-center text-white font-bold text-center relative ${
                                isToday ? "bg-blue" : "bg-gray-700"
                            }`}
                        >
                            <p className="font-medium text-sm">Day {day.day}</p>
                            <img
                                src="/assets/Images/star.png"
                                alt="gift"
                                className="w-10 h-10 my-2"
                            />
                            <p className="text-sm">{formatNumber(day.rewardValue)}</p>

                            {/* Overlay for claimed rewards */}
                            {isPastDay && (
                                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                                    <img
                                        src="/assets/Images/green-tick.png"
                                        alt="Claimed"
                                        className="w-10 h-10 shadow-2xl shadow-yellow z-1"
                                    />
                                </div>
                            )}

                            {/* Overlay for locked rewards */}
                            {isLocked && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <img
                                        src="/assets/Images/lock.png"
                                        alt="Locked"
                                        className="w-10 h-10 shadow-2xl shadow-yellow z-1"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                className={`bg-secondary rounded-md w-full mt-4 h-16 font-bold text-lg ${
                    isNextRewardDay() ? "opacity-100" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isNextRewardDay()}
                onClick={handleClaimReward}
            >
                {!isNextRewardDay() ? "Come Back Tomorrow" : "Claim Reward"}
            </button>
        </div>
    );
};

export default ClaimDailyReward;
