import React from 'react';
import { motion } from 'framer-motion';

interface CoinAnimationProps {
  coinsEarned: number;
  animate: boolean;
  onAnimationComplete: () => void;
}

const CoinAnimation: React.FC<CoinAnimationProps> = ({ coinsEarned, animate, onAnimationComplete }) => {
  return (
    <>
      {animate && (
        <motion.div
          className="absolute bottom-0 flex flex-wrap justify-center" // Flex-wrap for multiple rows
          initial={{ y: 0 }}
          animate={{ y: -50 }} // Animate coins upward
          transition={{ type: 'spring', stiffness: 300, onComplete: onAnimationComplete }}
        >
          {Array.from({ length: coinsEarned }).map((_, index) => (
            <motion.div
              key={index}
              className="m-1" // Margin for spacing
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/assets/Images/coin.png" 
                alt="Coin"
                className="w-10 h-10"
              />
            </motion.div>
          ))}
          <div className="text-yellow-300 text-2xl font-bold w-full text-center">{coinsEarned} Coins</div>
        </motion.div>
      )}
    </>
  );
};

export default CoinAnimation;
