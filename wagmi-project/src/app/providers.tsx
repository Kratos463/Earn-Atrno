"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { initializeWeb3Modal, config } from '@/wagmi'; // Adjust import path as needed

export function Providers(props: {
  children: ReactNode;
  initialState: any;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    initializeWeb3Modal(); // Initialize Web3Modal on mount
  }, []);

  return (
    <Provider store={store}>
      <WagmiProvider config={config} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
}
