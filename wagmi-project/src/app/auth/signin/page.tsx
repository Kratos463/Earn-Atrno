"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAccount, useConnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { checkWallet, registerOrLoginMember } from "../../../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import countryList from "react-select-country-list";
import Select from "react-select";
import { toast } from "react-toastify";

const Signin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const [country, setCountry] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const router = useRouter();

  const { isRegistered, registerLoading, checkWalletLoading, error, user } = useAppSelector(
    (state) => state.auth
  );

  // Memoized country options for performance
  const options = useMemo(
    () =>
      countryList().getData().map((country) => ({
        label: country.label,
        value: country.value,
      })),
    []
  );

  // Change handler for country select
  const changeHandler = useCallback((selectedOption: { value: string } | null) => {
    setCountry(selectedOption?.value || "");
  }, []);

  // Get referral code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCodeFromUrl = urlParams.get("startapp");
    if (referralCodeFromUrl) {
      setReferralCode(referralCodeFromUrl);
    }
  }, []);

  // Handle wallet registration or login
  useEffect(() => {
    const handleWalletRegistration = async () => {
      if (isConnected && address) {
        try {
          await checkWalletRegistration();
          if (isRegistered) {
            await dispatch(registerOrLoginMember({ walletAddress: address! }));
          }
        } catch (err) {
          console.error("Registration error:", err);
        }
      }
    };

    handleWalletRegistration();
  }, [isConnected, address, isRegistered, dispatch]);

  const checkWalletRegistration = async () => {
    if (!address) return;
    try {
      await dispatch(checkWallet({ walletAddress: address }));
    } catch (err) {
      console.error("Error checking wallet:", err);
    }
  };

  const handleRegister = async () => {
    if (!country.trim()) {
      toast.warning("Country is required.");
      return;
    }

    try {
      await dispatch(registerOrLoginMember({ walletAddress: address!, country, rbcode: referralCode }));
    } catch (err) {
      toast.error("Error during registration or login.");
      console.error("Error registering or logging in:", err);
    }
  };

  // Handle successful registration and token storage
  useEffect(() => {
    if (user?.success) {
      localStorage.setItem("token", user.token);
      router.push("/game/home");
    }
  }, [user, router]);

  const isLoading = registerLoading || checkWalletLoading;

  return (
    <div className="relative flex flex-col justify-end items-center min-h-screen bg-cover bg-center bg-no-repeat auth-wallpaper">
      <div className="text-center p-6 sm:p-8 rounded-lg max-w-md w-full mx-4 sm:mx-auto auth-content">
        <p className="text-xl sm:text-2xl mb-4 text-white shadow-lg">
          Join the ultimate ATRNO Arena! Connect your wallet to get started.
        </p>
        <div className="text-center flex items-center justify-center mb-5">
          <w3m-button size="md" label="Connect Wallet" balance="hide" />
        </div>

        {isConnected && !isRegistered && (
          <>
            <Select
              options={options}
              value={options.find((option) => option.value === country)}
              onChange={changeHandler}
              className="w-full mb-4 text-start"
            />
            <button
              className={`bg-dark text-white font-bold py-2 px-6 rounded-full transition duration-300 w-full sm:w-auto ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center items-center space-x-4 mb-4">
        {[faFacebookF, faTwitter, faInstagram].map((icon, index) => (
          <a
            key={index}
            href="#"
            className="w-12 h-12 flex items-center justify-center bg-dark text-white rounded-full shadow-md hover:bg-gray-400"
          >
            <FontAwesomeIcon icon={icon as any} className="text-white"/>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Signin;
