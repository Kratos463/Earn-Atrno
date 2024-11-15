"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheckCircle, faSync } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchFriendList } from "@/redux/authSlice";
import useLocalStorage from "@/helper/localStorage";
import Image from "next/image";

interface SkeletonLoaderProps {
  count: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="mb-4 flex items-center justify-between p-2 bg-secondary/20 text-white rounded-lg animate-pulse"
        >
          <div className="flex items-center text-left">
            <div className="w-10 h-10 rounded-full mr-4 bg-primary/20 p-1 bg-gray-700"></div>
            <div className="flex-grow">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-12"></div>
        </div>
      ))}
    </>
  );
};

const InviteFriends = () => {
  const tokenId = useLocalStorage("tokenId") || "";
  const dispatch = useAppDispatch();
  const { friendList, friendListLoading, member } = useAppSelector((state) => state.auth);
  const referralCode = member?.referralCode;
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Copy referral code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText( 
      `https://t.me/ATRNO_ARENA_BOT/start?startapp=${referralCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Delay reset to prevent re-render
  };

  // Fetch friend list if it's empty
  const fetchFriends = useCallback(() => {
    if (!friendList || friendList.length === 0) {
      dispatch(fetchFriendList(tokenId));
    }
    setRefreshing(false);
  }, [dispatch, tokenId]);

  // Fetch friends on initial render if friendList is empty
  useEffect(() => {
    if (!friendList) {
      fetchFriends();
    }
  }, [fetchFriends, friendList]);

  // Handle refresh icon click
  const handleRefreshClick = () => {
    if (!refreshing) {
      setRefreshing(true);
      fetchFriends();
    }
  };

  return (
    <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
      <Image
        src="/assets/Images/users_group.png"
        alt="User"
        className="mx-auto mb-4 w-20 h-20 shadow-2xl"
        width={50}
        height={50}
        quality={100}
      />
      <h1 className="text-2xl font-bold text-center">Invite Friends!</h1>

      {/* Description */}
      <p className="text-center text-gray-300 mb-6 text-xs">
        Share the joy of earning! Invite your friends and both of you will be rewarded with amazing bonuses.
      </p>

      {/* Invite a Friend Card */}
      <div className="bg-secondary/20 p-4 rounded-lg mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/assets/Images/gift.png"
            alt="gift"
            className="w-10 h-10 mr-4"
            quality={100}
            width={50}
            height={50}
          />
          <div className="text-left">
            <h3 className="text-sm font-medium">Invite a friend</h3>
            <div className="flex items-center text-xs text-yellow-300 font-bold">
              <Image
                src="/assets/Images/star.png"
                alt="image"
                className="w-4 h-4 rounded-full mr-1"
                width={10}
                height={10}
                quality={100}
              />
              +2500
              <span className="text-white font-normal ml-1"> for you and your friend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-secondary/20 p-4 rounded-lg mb-6 flex items-center">
        <div className="flex items-center mr-4">
          <Image
            src="/assets/Images/referral.png"
            alt="users"
            className="w-20 h-20 mr-4"
            quality={100}
            width={50}
            height={50}
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-left">Your Referral Code</h3>
          <p className="text-gray-300 mb-4 text-xs text-left">You and your friend will receive bonuses</p>
          <div className="flex items-center justify-start">
            <span className="text-lg text-white font-bold text-center bg-secondary/50 w-full p-2 rounded-md">
              Invite a friend
            </span>
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
            className={`p-2 ml-4 ${refreshing ? "animate-spin" : ""}`}
            disabled={refreshing}
          >
            <FontAwesomeIcon icon={faSync} className="text-yellow-300" />
          </button>
        </div>
        <ul>
          {friendListLoading ? (
            <>
              <SkeletonLoader count={5} />
            </>
          ) : friendList && friendList.length > 0 ? (
            friendList.map((friend) => (
              <li
                key={friend.firstName}
                className="mb-4 flex items-center justify-between p-2 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition"
              >
                <div className="flex items-center text-left">
                  <Image
                    src="/assets/Images/men.png"
                    alt="character"
                    className="w-10 h-10 rounded-full mr-4 bg-primary/20 p-1"
                    width={20}
                    height={20}
                    quality={100}
                  />
                  <div className="flex-grow">
                    <h3 className="text-sm font-semibold">{friend?.firstName}</h3>
                    <div className="text-xs text-gray-300">{friend?.levelDetails.name.toUpperCase()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src="/assets/Images/star.png"
                    alt="image"
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-sm font-bold text-yellow-300">2.5K</span>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center text-gray-300 mt-4">
              You haven’t invited any friends yet. Start sharing your referral code to earn rewards together!
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InviteFriends;
