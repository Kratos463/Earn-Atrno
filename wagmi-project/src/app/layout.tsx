import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
import './fontawesome';
import { Providers } from './providers';
import { cookieToInitialState, type State } from 'wagmi';
import { config } from '@/wagmi'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atrno Arena - Play & Earn Crypto Rewards with Daily Tasks and Tapping',
  description:
    'Join Atrno Arena, a tap-and-earn blockchain-based game where you can earn crypto rewards by completing daily tasks and logging in. Connect your blockchain wallet, tap to collect coins, and enjoy exciting challenges to maximize your earnings. Simple, fun, and rewarding, Atrno Arena offers an engaging way to boost your crypto holdings while playing.',
};

export default function RootLayout(props: { children: ReactNode }) {
  const cookies = headers().get('cookie') || '';
  
  // Call cookieToInitialState with the correct config object
  const initialState = cookieToInitialState(config, cookies) || {}; 

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>{props.children}</Providers>
      </body>
    </html>
  );
}
