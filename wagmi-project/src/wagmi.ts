import { polygon } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

// Define Web3Modal configuration
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '002b8d71ece5792884cadf6dd885472b';

// Define the metadata for Web3Modal
const metadata = {
  name: 'Atrno Arena',
  description: 'Play & Earn with daily tasks and blockchain-based rewards.',
  url: 'http://localhost:9000',
  icons: ['https://atrnoarenaapi.aeternus.foundation/public/images/logo.png'], 
};

// Define the chains for Web3Modal
const chains = [polygon] as const; 

// Create the Wagmi configuration
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// Initialize Web3Modal
export function initializeWeb3Modal() {
  const web3Modal = createWeb3Modal({
    metadata,
    wagmiConfig: config,
    projectId,
  });

  return web3Modal;
}
