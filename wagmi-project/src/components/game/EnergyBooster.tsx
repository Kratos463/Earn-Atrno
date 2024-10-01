"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchEnergyBooster, fetchTapBooster } from "@/redux/levelSlice";
import BoosterModal from "./BoosterModel";
import { Booster } from "@/redux/types/booster";

const EnergyBooster = () => {
  const [selectedBooster, setSelectedBooster] = useState<Booster | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const { energyBooster, tapBooster } = useAppSelector((state) => state.level);

  // Handle booster click to open modal
  const handleBoosterClick = (booster: Booster) => {
    if (booster) {
      setSelectedBooster(booster);
      setIsModalOpen(true);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooster(null);
  };

  useEffect(() => {
    dispatch(fetchEnergyBooster());
    dispatch(fetchTapBooster());
  }, [dispatch]);

  return (
    <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
      <img
        src="/assets/Images/booster.png"
        alt="User"
        className="mx-auto mb-4 w-20 h-20 shadow-2xl"
      />
      <h1 className="text-2xl font-bold text-center">
        Boost Your Energy and Coin Tap!
      </h1>
      <p className="text-center text-gray-300 mb-6 text-xs">
        Tap on the Coin Booster to instantly increase your energy levels and
        maximize your rewards! Keep your game going strong by using your
        boosters wisely.
      </p>

      {/* Energy Booster */}
      <li className="mb-4 list-none">
        <div
          className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition cursor-pointer"
          onClick={() => handleBoosterClick(energyBooster!)} // Assert that energyBooster is not null
        >
          <div className="flex items-center">
            <img
              src="/assets/Images/flash.png"
              className="w-10 h-10 object-cover rounded-full mr-4"
              style={{ boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px" }}
            />
            <div>
              <h3 className="text-sm">Boost Energy</h3>
              <div className="flex items-center text-xs">
                <img
                  src="/assets/Images/star.png"
                  alt="reward"
                  className="w-4 h-4 rounded-full mr-1"
                />
                <span className="text-yellow-300 font-bold mr-1">
                  {energyBooster?.cost || 0}
                </span>{" "}
                • Lvl {energyBooster?.level || 0}
              </div>
            </div>
          </div>
        </div>
      </li>

      {/* Tap Booster */}
      <li className="mb-4 list-none">
        <div
          className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition cursor-pointer"
          onClick={() => handleBoosterClick(tapBooster!)} // Assert that tapBooster is not null
        >
          <div className="flex items-center">
            <img
              src="/assets/Images/coin-tap.png"
              className="w-10 h-10 object-cover rounded-full mr-4"
              style={{ boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px" }}
            />
            <div>
              <h3 className="text-sm">Boost Tap</h3>
              <div className="flex items-center text-xs">
                <img
                  src="/assets/Images/star.png"
                  alt="reward"
                  className="w-4 h-4 rounded-full mr-1"
                />
                <span className="text-yellow-300 font-bold mr-1">
                  {tapBooster?.cost || 0}
                </span>{" "}
                • Lvl {tapBooster?.level || 0}
              </div>
            </div>
          </div>
        </div>
      </li>

      {isModalOpen && selectedBooster && (
        <BoosterModal booster={selectedBooster} onClose={closeModal} />
      )}
    </div>
  );
};

export default EnergyBooster;
