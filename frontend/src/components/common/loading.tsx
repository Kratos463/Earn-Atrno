"use client";

import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const socialImages = [
  {
    icon: faFacebookF,
    link: "https://www.facebook.com/aeternusfoundation123/",
  },
  {
    icon: faInstagram,
    link: "https://www.instagram.com/aeternusfoundation?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    icon: faTwitter,
    link: "https://x.com/AeternusF",
  },
];

const Loading: React.FC = () => {
  const memoizedSocialImages = useMemo(() => socialImages, []);

  return (
    <div className="relative flex flex-col justify-end items-center min-h-screen bg-cover bg-center bg-no-repeat auth-wallpaper">
      <div className="text-center p-6 sm:p-8 rounded-lg max-w-md w-full mx-4 sm:mx-auto auth-content">
        <p className="text-xl sm:text-2xl mb-4 text-white shadow-lg">
          Join the ultimate ATRNO Arena!
        </p>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center items-center space-x-4 mb-10">
        {memoizedSocialImages.map((icon, index) => (
          <a
            key={index}
            href={icon.link}
            className="w-12 h-12 flex items-center justify-center bg-dark text-white rounded-full shadow-md hover:bg-gray-400"
          >
            <FontAwesomeIcon icon={icon.icon as any} className="text-white" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Loading;
