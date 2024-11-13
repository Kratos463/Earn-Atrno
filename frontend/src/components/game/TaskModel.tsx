import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DailyTask } from '@/redux/types/officialTask';
import { configHeader } from '@/helper/configHeader';
import { toast } from "react-toastify";
import axios from 'axios';
import useLocalStorage from '@/helper/localStorage';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCurrentMember } from '@/redux/authSlice';

const socialImages: Record<string, string> = {
  YouTube: '/assets/Images/youtube.png',
  Telegram: '/assets/Images/telegram.png',
  Facebook: '/assets/Images/facebook.png',
  Instagram: '/assets/Images/instagram.png',
  Twitter: '/assets/Images/twitter.png',
};

interface TaskModalProps {
  task: DailyTask;
  onClose: () => void;
  type: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, type }) => {
  const tokenId = useLocalStorage("tokenId") || ""
  const {member} = useAppSelector((state) => state.auth)
  const [canCheck, setCanCheck] = useState<boolean>(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const dispatch = useAppDispatch()

  const taskType = type === "official" ? "officialTask" : "dailyTaskProgress";
  const isTaskCompleted = member[taskType]?.some((completedTask) => completedTask.taskId === task._id);


  useEffect(() => {
    const lastJoinedTime = localStorage.getItem(`join_time_${task.url}`);
    const storedMessage = localStorage.getItem(`message_${task.url}`);

    if (storedMessage) {
      setMessage(storedMessage);
    }

    if (lastJoinedTime) {
      const elapsedMs = Date.now() - new Date(lastJoinedTime).getTime();
      const remainingMs = 3600000 - elapsedMs;

      if (remainingMs <= 0) {
        setCanCheck(true);
        setMessage('You can now check if you followed the account.');
      } else {
        const remainingMins = Math.ceil(remainingMs / 60000); 
        setRemainingMinutes(remainingMins);

        const intervalId = setInterval(() => {
          const updatedElapsedMs = Date.now() - new Date(lastJoinedTime).getTime();
          const updatedRemainingMs = 3600000 - updatedElapsedMs;

          if (updatedRemainingMs <= 0) {
            setCanCheck(true);
            setMessage('You can now check if you followed the account.');
            localStorage.setItem(`message_${task.url}`, 'You can now check if you followed the account.');
            clearInterval(intervalId);
          } else {
            setRemainingMinutes(Math.ceil(updatedRemainingMs / 60000));
          }
        }, 60000);

        return () => clearInterval(intervalId);
      }
    }
  }, [task.url]);

  const handleJoinClick = () => {
    window.open(task.url, '_blank');
    const currentTime = new Date().toISOString();
    localStorage.setItem(`join_time_${task.url}`, currentTime);
    setCanCheck(false);
    const newMessage = 'You have joined successfully! Please wait for 1 hour before checking for rewards.';
    setMessage(newMessage);
    localStorage.setItem(`message_${task.url}`, newMessage);
    setRemainingMinutes(60);
  };

  const handleCheckClick = async () => {
    try {
      const response = await axios.post(`/api/v1/task/${type}-task/claim/${task._id}?telegramId=${tokenId}`, {}, configHeader());
      if (response.data.success) {
        toast.success('Congratulations! You have earned coins.');
        onClose()
        dispatch(fetchCurrentMember(tokenId))
      } else {
        onClose()
        toast.warning('You have not followed yet. Please follow the account to earn rewards.');
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
          src={socialImages[task?.platform || '']}
          alt={task?.platform}
          className="w-16 h-16 object-cover rounded-full mb-4"
        />

        <h2 className="text-2xl font-bold mb-4 text-white">{task.title}</h2>

        {task?.description && <p className='text-sm mb-4'>{task?.description}</p>}

        <div className="mb-4 w-full flex flex-col items-center gap-3">
          <button
            onClick={handleJoinClick}
            className="px-4 py-4 mb-2 w-2/4 rounded-md text-white bg-secondary/50 hover:bg-secondary/70"
          >
            {task?.description ? "Complete Task" : "Join"}
          </button>
          {message && (
            <p className="text-white mt-4">
              {canCheck
                ? message
                : `Please wait for ${remainingMinutes} minute(s) before checking for rewards.`}
            </p>
          )}

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
            disabled={!canCheck || isTaskCompleted}
            className={`px-4 py-4 w-full rounded-md text-white ${!canCheck || isTaskCompleted ? 'bg-gray-500' : 'bg-secondary/50 hover:bg-secondary/70'}`}
          >
            Check
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskModal;
