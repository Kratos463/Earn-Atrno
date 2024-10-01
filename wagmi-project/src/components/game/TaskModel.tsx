import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { OfficialTask } from '@/redux/types/officialTask';
import CoinAnimation from './CoinAnimation';

interface TaskModalProps {
  task: OfficialTask;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const [canCheck, setCanCheck] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const lastJoinedTime = localStorage.getItem(`join_time_${task.socialMediaType}`);
    if (lastJoinedTime) {
      const timeElapsed = Date.now() - new Date(lastJoinedTime).getTime();
      if (timeElapsed >= 3600000) {
        setCanCheck(true);
      } else {
        const timeoutId = setTimeout(() => {
          setCanCheck(true);
          setMessage('You can now check if you followed the account.');
        }, 3600000 - timeElapsed);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [task.socialMediaType]);

  const handleJoinClick = () => {
    window.open(task.url, '_blank');
    const currentTime = new Date().toISOString();
    localStorage.setItem(`join_time_${task.socialMediaType}`, currentTime);
    setCanCheck(false);
    setMessage('You have joined successfully! Please wait for 1 hour before checking for rewards.');
  };

  const handleCheckClick = async () => {
    try {
      const response = await fetch(`/api/v1/check-follow?platform=${task.socialMediaType}`);
      const data = await response.json();
      if (data.followed) {
        alert('Congratulations! You have earned coins.');
      } else {
        alert('You have not followed yet. Please follow the account to earn rewards.');
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={handleBackgroundClick}
    >
      <motion.div
        className="relative bg-dark w-full max-w-[600px] p-6 rounded-lg text-center flex flex-col items-center"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          boxShadow: '0 -8px 20px rgba(232, 163, 255, 0.75)',
        }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <img
          src={`https://atrnoarenaapi.aeternus.foundation/${task.icon}`}
          alt={task?.socialMediaType}
          className="w-16 h-16 object-cover rounded-full mb-4"
        />

        <h2 className="text-2xl font-bold mb-4 text-white">{task.title}</h2>

        <div className="mb-4 w-full flex flex-col items-center gap-3">
          <button
            onClick={handleJoinClick}
            className="px-4 py-4 mb-2 w-2/4 rounded-md text-white bg-secondary/50 hover:bg-secondary/70"
          >
            Join
          </button>
            {message && <p className="text-white mt-4">{message}</p>}

          <div className="flex items-center text-xl text-yellow-300 font-bold mb-2">
            <img
              src="/assets/Images/star.png"
              alt="reward"
              className="w-6 h-6 rounded-full mr-1"
            />
            {task.reward}
          </div>
          <button
            onClick={handleCheckClick}
            disabled={!canCheck}
            className={`px-4 py-4 w-full rounded-md text-white ${!canCheck ? 'bg-gray-500' : 'bg-secondary/50 hover:bg-secondary/70'}`}
          >
            Check
          </button>

        </div>

      </motion.div>
    </motion.div>
  );
};

export default TaskModal;
