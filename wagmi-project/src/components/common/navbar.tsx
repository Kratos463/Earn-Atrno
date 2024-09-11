"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTasks, faUser, faUsers, faGift } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Correct hook for Next.js 13+ App Router

const Navbar = () => {
  const currentPath = usePathname(); // Get the current path

  return (
    <nav className="bg-primary w-full fixed bottom-0 left-0 flex items-center mt-3">
      <ul className="flex justify-between md:justify-evenly items-center w-full">
        {[
          { id: "home", icon: faHome, label: "Home", path: "/" },
          { id: "tasks", icon: faTasks, label: "Tasks", path: "/game/tasks" },
          { id: "friends", icon: faUsers, label: "Friends", path: "/game/friend" },
          { id: "dailyreward", icon: faGift, label: "Daily Reward", path: "/game/dailyreward" },
        ].map(({ id, icon, label, path }) => {
          const isActive = currentPath === path; // Determine if the path is active

          return (
            <li
              key={id}
              className={`flex-1 py-2 text-center transition-all duration-300 ease-in-out  
            ${
                isActive
                  ? 'bg-secondary/20 text-secondary'
                  : "text-gray-400"
              } hover:bg-secondary/20 hover:text-white hover:backdrop-blur-sm cursor-pointer rounded-md m-2 sm:m-0`}
            >
              <Link href={path} className="flex flex-col items-center">
                <FontAwesomeIcon icon={icon} size="lg" />
                <span className="block text-xs mt-1">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
