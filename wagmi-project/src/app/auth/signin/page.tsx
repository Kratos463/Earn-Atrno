"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { checkWallet, registerOrLoginMember } from "../../../redux/authSlice";
import { setCookie } from '../../../helper/setCookie';

const Signin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const [country, setCountry] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const router = useRouter();

  // Accessing state from Redux store
  const { isRegistered, registerLoading, checkWalletLoading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCodeFromUrl = urlParams.get("startapp");
    if (referralCodeFromUrl) {
      setReferralCode(referralCodeFromUrl);
    }
  }, []);

  useEffect(() => {
    const handleWalletRegistration = async () => {
      if (isConnected && address) {
        await checkWalletRegistration();

        if (isRegistered) {

          await dispatch(registerOrLoginMember({ walletAddress: address! }));
        }
      }
    };

    handleWalletRegistration();
  }, [isConnected, address]);


  const checkWalletRegistration = async () => {
    if (!address) return;

    await dispatch(checkWallet({ walletAddress: address }));
  };

  const handleConnectWallet = async () => {
    if (!isConnected) {
      const walletConnector = connectors[0];
      try {
        await connect({ connector: walletConnector });
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const handleRegister = async () => {
    if (!country.trim()) {
      alert("Country is required.");
      return;
    }

    try {
      await dispatch(registerOrLoginMember({ walletAddress: address!, country, rbcode: referralCode }));
    } catch (error) {
      console.error("Error registering or logging in:", error);
    }
  };

  // Redirect if user is successfully registered or logged in
  useEffect(() => {
    if (user && user.success) {
      console.log("User token", user.token)
      setCookie("token", user.token, 30);
      router.push("/game/home");
    }
  }, [user, router]);

  // Render loading state
  const isLoading = registerLoading || checkWalletLoading;

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/assets/Images/home_wallpaper.jpg')` }}
    >
      <div className="text-center bg-white bg-opacity-80 p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full mx-4 sm:mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
          Aeternus Foundation
        </h1>
        <p className="text-lg sm:text-xl mb-6 text-gray-700">
          Join the ultimate aeternus battle arena! Connect your wallet to get started.
        </p>

        <w3m-button />


        {/* Country Input and Register Button */}
        {isConnected && !isRegistered && (
          <>
            <input
              type="text"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full text-gray-700 mb-4"
              disabled={isLoading}
            />
            <button
              className="bg-primary text-white font-bold py-2 px-6 rounded-full transition duration-300 w-full sm:w-auto"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 mt-4">
            {error}
          </p>
        )}
      </div>

      {/* Game Introduction or Feature Highlights */}
      <section className="bg-primary text-white p-6 sm:p-8 mt-8 rounded-lg shadow-lg max-w-3xl mx-4 sm:mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Why Play Aeternus Foundation?
        </h2>
        <ul className="list-disc pl-5 text-left">
          <li className="mb-2">Epic hamster battles with unique abilities.</li>
          <li className="mb-2">
            Customize your hamster with special skins and gear.
          </li>
          <li className="mb-2">
            Challenge friends and climb the leaderboards.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Signin;
