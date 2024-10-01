"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import TaskModal from './TaskModel';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { fetchOfficialTasks } from '@/redux/officialTaskSlice';
import { OfficialTask } from '@/redux/types/officialTask';

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { officialTasks, fetchLoading, error } = useAppSelector((state) => state.officialTask);
  const [selectedTask, setSelectedTask] = useState<OfficialTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOfficialTasks());
  }, [dispatch]);

  const handleTaskClick = (task: OfficialTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Memoizing officialTasks to prevent unnecessary re-renders
  const memoizedOfficialTasks = useMemo(() => {
    return officialTasks;
  }, [officialTasks]);

  return (
    <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
      {/* Hero Image */}
      <img src="/assets/Images/star.png" alt="Bitcoin" className="mx-auto mb-4 w-20 h-20 shadow-2xl" />

      <h1 className="text-2xl font-bold text-center mb-2">More Tasks, More Rewards</h1>

      {/* Description */}
      <p className="text-center text-gray-300 mb-6 text-xs">
        Boost your productivity! Track tasks, hit your goals, and stay organized with ease. Every task completed brings you closer to success!
      </p>

      {/* Official Tasks Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">Atrno Official</h2>
        <ul>
          {memoizedOfficialTasks?.map((task) => (
            <li className="mb-4" key={task._id} onClick={() => handleTaskClick(task)}>
              <div className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition cursor-pointer">
                <div className="flex items-center">
                  <img
                    src={`https://atrnoarenaapi.aeternus.foundation/${task.icon}`}
                    alt={task?.socialMediaType}
                    className="w-10 h-10 object-cover rounded-full mr-4"
                    style={{ boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px' }}
                  />
                  <div>
                    <h3 className="text-sm">{task?.title}</h3>
                    <div className="flex items-center text-xs text-yellow-300 font-bold">
                      <img src="/assets/Images/star.png" alt="reward" className="w-4 h-4 rounded-full mr-1" />
                      {task.reward}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Task Modal */}
      {isModalOpen && selectedTask && <TaskModal task={selectedTask} onClose={closeModal} />}
    </div>
  );
};

export default TaskList;
