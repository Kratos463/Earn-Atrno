"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./providers";
import Loading from "@/components/common/loading";
import { useAppDispatch, useAppSelector } from "@/redux/store";

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: any;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useAppDispatch();
  const { currentMemberLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const telegramId = urlParams.get("telegramId");

          if (telegramId) {
            localStorage.setItem("tokenId", telegramId);
          }
        }
      } catch (error) {
        console.error("Failed to get telegram id:", error);
      } finally {
        // Set the loader to show and wait for 3 seconds
        setShowLoader(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    fetchMember();
  }, [dispatch]);

  useEffect(() => {
    // If currentMemberLoading is true, show the loader
    if (currentMemberLoading) {
      setShowLoader(true);
    }
  }, [currentMemberLoading]);

  // Hide loader after loading is done
  useEffect(() => {
    if (!isLoading && !currentMemberLoading) {
      setShowLoader(false);
    }
  }, [isLoading, currentMemberLoading]);

  return (
    <Providers>
      {(showLoader || currentMemberLoading) && (
        <div className="loader">
          <Loading />
        </div>
      )}
      {!showLoader && !currentMemberLoading && (
        <>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
        </>
      )}
    </Providers>
  );
}

export default MyApp;
