"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCopy, faCheckCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchFriendList } from '@/redux/authSlice';
import character from '../../../public/assets/Images/character.png';
import { formatNumber } from '@/helper/convertNumber';

export const SkeletonLoader: React.FC = () => (
    <div className="mb-4 flex items-center justify-between p-2 bg-secondary/20 text-white rounded-lg animate-pulse">
        <div className="flex items-center text-left">
            <div className="w-10 h-10 rounded-full mr-4 bg-primary/20 p-1 bg-gray-700"></div>
            <div className="flex-grow">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-12"></div>
    </div>
);

const InviteFriends: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { friendList, friendListLoading, member } = useAppSelector((state) => state.auth);
    const referralCode = member?.referralCode;
    const [copied, setCopied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const initialFetchDone = useRef(false);

    // Copy referral code to clipboard
    const handleCopyCode = () => {
        navigator.clipboard.writeText(`https://atrnoarena.aeternus.foundation/signin/auth?startapp=${referralCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Fetch friend list
    const fetchFriends = useCallback(() => {
        dispatch(fetchFriendList());
        setRefreshing(true);
        setCountdown(60);
    }, [dispatch]);

    // Effect to handle countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setRefreshing(false);
        }
    }, [countdown]);

    // Fetch friends on initial render
    useEffect(() => {
        if (!initialFetchDone.current) {
            fetchFriends();
            initialFetchDone.current = true;
        }
    }, [fetchFriends]);

    // Handle refresh icon click
    const handleRefreshClick = () => {
        if (!refreshing) {
            setRefreshing(true)
            fetchFriends();
            setRefreshing(false)
        }
    };

    // Skeleton Loader Component
 

    return (
        <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
            <img
                src="/assets/Images/users_group.png"
                alt="User"
                className="mx-auto mb-4 w-20 h-20 shadow-2xl"
            />
            <h1 className="text-2xl font-bold text-center">Invite Friends!</h1>

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
                                    <img
                                        src='/assets/Images/star.png'
                                        alt='image'
                                        className="w-4 h-4 rounded-full mr-1"
                                    /> +2500 <span className="text-white font-normal ml-1">for you and your friend</span>
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
                    <div className="flex items-center justify-start">
                        <span className="text-lg text-white font-bold text-center  bg-secondary/50 w-full  p-2 rounded-md">Invite a friend</span>
                        <button
                            onClick={handleCopyCode}
                            className="ml-2 py-2 px-3 bg-secondary/50 rounded-md transition font-bold text-lg"
                        >
                            <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Friends List */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">
                        Your Friend List ({friendList ? friendList.length : "0"})
                    </h2>
                    <button
                        onClick={handleRefreshClick}
                        className={`p-2 ml-4 ${refreshing ? 'animate-spin' : ''}`}
                        disabled={refreshing}
                    >
                        <FontAwesomeIcon
                            icon={faSync}
                            className="text-yellow-300"
                        />
                    </button>
                </div>
                <ul>
                    {
                        friendListLoading ? (
                            <>
                                <SkeletonLoader />
                                <SkeletonLoader />
                                <SkeletonLoader />
                            </>
                        ) : friendList && friendList.length > 0 ? (
                            friendList.map((friend) => (
                                <li key={friend._id} className="mb-4 flex items-center justify-between p-2 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition">
                                    <div className="flex items-center text-left">
                                        <img
                                            src={character.src}
                                            alt={friend.friendsDetails.referralCode}
                                            className="w-10 h-10 rounded-full mr-4 bg-primary/20 p-1"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-sm font-semibold">{friend.friendsDetails.referralCode}</h3>
                                            <div className="text-xs text-gray-300">
                                                {friend.levelDetails.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                    <img
                                        src='/assets/Images/star.png'
                                        alt='image'
                                        className="w-4 h-4 rounded-full"
                                    />
                                        <span className="text-sm font-bold text-yellow-300">
                                            {formatNumber(friend.reward)}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="text-center text-gray-300 mt-4">
                                You haven’t invited any friends yet. Start sharing your referral code to earn rewards together!
                            </div>
                        )
                    }
                </ul>
            </div>
        </div>
    );
});

export default InviteFriends;
