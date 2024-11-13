"use client";
import React from "react";
import Navbar from "../common/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <main>
          <div
            className="bg-dark overflow-scroll h-screen"
          >
            {children}
          </div>
        </main>
        <Navbar />
      </div>
    </>
  );
}
