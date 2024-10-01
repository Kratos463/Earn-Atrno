import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Booster } from "@/redux/types/booster";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { configHeader } from "@/helper/configHeader";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchCurrentMember } from "@/redux/authSlice";
import { fetchEnergyBooster, fetchTapBooster } from "@/redux/levelSlice";

interface BoosterModalProps {
  booster: Booster;
  onClose: () => void;
}

const BoosterModal: React.FC<BoosterModalProps> = ({ booster, onClose }) => {

  const dispatch = useAppDispatch()
  const [canCheck, setCanCheck] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const { member } = useAppSelector((state) => state.auth);

  const handleCheckClick = async () => {
    setIsChecking(true);
    try {
      console.log("Headrs", configHeader())
      const response = await axios.post(
        booster.energy
        ? `/api/v1/booster/boost-energy/${booster._id}`
        : `/api/v1/booster/boost-tap/${booster._id}`,
        {},
        {
          ...configHeader(),
        }
      );
      const data = response.data;
      console.log("data",data)
      if (data.success) {
        toast.success(
          "Congratulations! You have earned more energy or power-ups."
        );
        onClose();
        dispatch(fetchEnergyBooster());
      dispatch(fetchTapBooster());
        dispatch(fetchCurrentMember())
      } else {
        toast.error(
          "You do not have enough resources to activate this booster."
        ); // Error toast
      }
    } catch (error) {
      console.error("Error checking booster activation status:", error);
      toast.error("An error occurred while activating the booster."); // Error toast on catch
    } finally {
      setIsChecking(false);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleBackgroundClick}
    >
      <motion.div
        className="relative bg-dark w-full max-w-[600px] p-6 rounded-lg text-center flex flex-col items-center"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          boxShadow: "0 -8px 20px rgba(232, 163, 255, 0.75)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <img
          src="/assets/Images/booster.png"
          alt="booster icon"
          className="w-16 h-16 object-cover rounded-full mb-4"
        />

        <h1 className="text-2xl font-bold mb-4 text-white">
          Booster Level: {booster.level}
        </h1>

        <div className="mb-4 w-full flex flex-col items-center gap-3">
          <div className="flex items-center text-xl text-yellow-300 font-bold mb-2">
            <img
              src="/assets/Images/star.png"
              alt="reward"
              className="w-6 h-6 rounded-full mr-1"
            />
            {booster.cost} Coins
          </div>

          {booster.energy && (
            <div className="text-white text-sm">
              Energy Boost: {booster.energy} <br /> Increases your energy
              levels, keeping you active longer.
            </div>
          )}
          {booster.tap && (
            <div className="text-white text-sm">
              Tap Boost: {booster.tap} <br /> Enhances your coin tap power for
              quicker rewards.
            </div>
          )}

          <button
            disabled={member?.wallet?.coins < booster.cost}
            className={`mt-4 px-4 py-4 bg-secondary/50 text-white rounded-md w-full hover:bg-secondary/70`}
            onClick={handleCheckClick}
          >
            {isChecking ? "Boosting..." : "Boost Now"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BoosterModal;
