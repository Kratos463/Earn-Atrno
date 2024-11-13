"use client";

import React, { useState, useEffect, useRef } from "react";
import TopLeftIcons from "./topLeftIcons";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchCurrentMember, tapCoin } from "@/redux/authSlice";
import Link from "next/link";
import useLocalStorage from "@/helper/localStorage";

const TapOnCoinCounter: React.FC = () => {
  const telegramId = useLocalStorage("tokenId") || "";
  const dispatch = useAppDispatch();
  const { member } = useAppSelector((state) => state.auth);

  // Initialize points from localStorage or member data
  const initialPoints =
    typeof window !== "undefined"
      ? parseInt(
          localStorage.getItem("points") ||
            (member.wallet?.coins ?? 0).toString()
        )
      : member.wallet?.coins ?? 0;

  const pointsToAdd = member?.powerUps?.onTap ?? 0;
  const maxEnergy = member?.powerUps?.energy ?? 0;

  // Initialize energy from localStorage or set to max energy if no saved value
  const initialEnergy =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("energy") ?? maxEnergy.toString())
      : maxEnergy;

  const [points, setPoints] = useState<number>(initialPoints);
  const [energy, setEnergy] = useState<number>(initialEnergy);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const energyRegenInterval = useRef<NodeJS.Timeout | null>(null);
  const apiCallTimeout = useRef<NodeJS.Timeout | null>(null);

  // Save points and energy to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("points", points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem("energy", energy.toString());
  }, [energy]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy <= 0) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);

    // Update points and energy on each tap
    setPoints((prevPoints) => prevPoints + pointsToAdd);
    setEnergy((prevEnergy) => Math.max(prevEnergy - pointsToAdd, 0));

    setClicks((prevClicks) => [
      ...prevClicks,
      { id: Date.now(), x: e.pageX, y: e.pageY },
    ]);
    setLastTapTime(Date.now());
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const makeApiCall = () => {
    dispatch(tapCoin({ incrementPoint: points, telegramId }));
  };

  // Energy regeneration logic
  useEffect(() => {
    if (!energyRegenInterval.current) {
      energyRegenInterval.current = setInterval(() => {
        setEnergy((prevEnergy) => {
          if (prevEnergy < maxEnergy) {
            return Math.min(prevEnergy + 1, maxEnergy);
          }
          return prevEnergy;
        });
      }, 1000);
    }

    return () => {
      if (energyRegenInterval.current) {
        clearInterval(energyRegenInterval.current);
        energyRegenInterval.current = null;
      }
    };
  }, [maxEnergy]);

  useEffect(() => {
    if (lastTapTime) {
      if (apiCallTimeout.current) {
        clearTimeout(apiCallTimeout.current);
      }
      apiCallTimeout.current = setTimeout(() => {
        makeApiCall();
      }, 1000);
    }
    return () => {
      if (apiCallTimeout.current) {
        clearTimeout(apiCallTimeout.current);
      }
    };
  }, [lastTapTime, points]);

  useEffect(() => {
    if (telegramId) {
      dispatch(fetchCurrentMember(telegramId))
        .unwrap()
        .then((fetchedMember) => {
          const fetchedPoints = fetchedMember?.wallet?.coins || 0;
          const fetchedEnergy = fetchedMember?.powerUps?.energy || 100;

          // Save fetched values in localStorage
          localStorage.setItem("points", fetchedPoints.toString());
          localStorage.setItem("energy", fetchedEnergy.toString());

          // Set state with the fetched values
          setPoints(fetchedPoints);
          setEnergy(fetchedEnergy);
        })
        .catch((error) => {
          console.error("Failed to fetch member:", error);
        });
    }
  }, [dispatch, telegramId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 relative bg-dark">
      {/* Top Left Icons */}
      <TopLeftIcons />

      {/* Total Coins Display */}
      <div className="mb-4 text-white text-3xl md:text-4xl lg:text-5xl flex items-center justify-center space-x-2">
        <img
          src="/assets/Images/star.png"
          alt="Dollar"
          className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
        />
        <span className="font-bold text-white">{points?.toLocaleString()}</span>
      </div>

      {/* Coin Image */}
      <div className="flex justify-center">
        <div
          className="w-80 h-80 p-4 rounded-full circle-outer"
          onClick={handleCardClick}
        >
          <div className="w-full h-full rounded-full circle-inner p-2">
            <img
              src="/assets/Images/character.png"
              alt="Main Character"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Energy Display */}
      <div className="flex justify-between items-center absolute bottom-20 py-8 left-0 right-0 px-3">
        <div className="px-3 py-1 bg-secondary/20 rounded-full text-white text-md md:text-lg lg:text-xl flex items-center space-x-1 h-8 md:h-10 lg:h-14">
          <img
            src="/assets/Images/flash.png"
            alt="Energy"
            className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
          />
          <span className="text-xs md:text-sm lg:text-sm text-white font-medium">
            {energy}/{maxEnergy}
          </span>
        </div>

        <Link href="/game/energy-boost">
          <div className="px-3 py-1 bg-secondary/20 rounded-full text-white text-md md:text-lg lg:text-xl flex items-center space-x-1 h-8 md:h-10 lg:h-14">
            <img
              src="/assets/Images/booster.png"
              alt="Booster"
              className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
            />
            <span className="text-xs md:text-sm lg:text-sm text-white font-medium">
              Booster
            </span>
          </div>
        </Link>
      </div>

      {/* Floating Point Animation for each tap */}
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          +{pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default TapOnCoinCounter;
