// wagmi.ts

import { polygon } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

// Define Web3Modal configuration
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '002b8d71ece5792884cadf6dd885472b';

const metadata = {
  name: 'Earn Atrno',
  description: 'YourAppDescription',
  url: 'https://earnatrno.com',
  icons: ['https://yourapp.com/icon.png'],
};

const chains = [polygon] as const; // Added polygon here
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});


// Initialize Web3Modal
export function initializeWeb3Modal() {
  createWeb3Modal({
    metadata,
    wagmiConfig: config,
    projectId,
    enableAnalytics: true,
  });
}
