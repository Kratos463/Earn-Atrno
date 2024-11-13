"use client";

import React, { useState, useEffect, useMemo } from "react";
import TaskModal from "./TaskModel";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { fetchDailyTasks, fetchOfficialTasks } from "@/redux/officialTaskSlice";
import { DailyTask } from "@/redux/types/officialTask";
import { SkeletonLoader } from "./InviteFriends";
import Image from "next/image";

const socialImages: Record<string, string> = {
  YouTube: "/assets/Images/youtube.png",
  Telegram: "/assets/Images/telegram.png",
  Facebook: "/assets/Images/facebook.png",
  Instagram: "/assets/Images/instagram.png",
  Twitter: "/assets/Images/twitter.png",
};

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dailyTasks, officialTasks, fetchLoading } = useAppSelector(
    (state) => state.officialTask
  );
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<string>("");
  const { member } = useAppSelector((state) => state.auth);

  // Fetch tasks only if they are not already loaded
  useEffect(() => {
    if (!dailyTasks.length) {
      dispatch(fetchDailyTasks());
    }
    if (!officialTasks.length) {
      dispatch(fetchOfficialTasks());
    }
  }, [dispatch, dailyTasks.length, officialTasks.length]);

  const handleTaskClick = (task: any, type: string) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setType(type);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const memoizedDailyTasks = useMemo(() => dailyTasks, [dailyTasks]);
  const memoizedOfficialTasks = useMemo(() => officialTasks, [officialTasks]);
  const memoizedSocialImages = useMemo(() => socialImages, []);

  return (
    <div className="pb-20 p-4 text-white mx-auto max-w-[600px]">
      {/* Hero Image */}
      <Image
        src="/assets/Images/star.png"
        alt="Star Icon"
        className="mx-auto mb-4 w-20 h-20 shadow-2xl"
        width={50}
        height={50}
        quality={100}
      />

      <h1 className="text-2xl font-bold text-center mb-2">
        More Tasks, More Rewards
      </h1>

      {/* Description */}
      <p className="text-center text-gray-300 mb-6 text-xs">
        Boost your productivity! Track tasks, hit your goals, and stay organized
        with ease. Every task completed brings you closer to success!
      </p>

      {/* Daily Tasks Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">
          Atrno Daily Tasks
        </h2>
        <ul>
          {fetchLoading && !memoizedDailyTasks.length ? (
            <SkeletonLoader count={2} />
          ) : (
            memoizedDailyTasks?.map((task) => (
              <li
                className="mb-4"
                key={task._id}
                onClick={() => handleTaskClick(task, "daily")}
              >
                <div className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition cursor-pointer">
                  <div className="flex items-center">
                    <Image
                      src={memoizedSocialImages[task?.platform || ""]}
                      alt={task?.platform}
                      className="w-10 h-10 object-cover rounded-full mr-4"
                      style={{
                        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
                      }}
                      width={20}
                      height={20}
                      quality={100}
                    />
                    <div>
                      <h3 className="text-sm">{task?.title}</h3>
                      <div className="flex items-center text-xs text-yellow-300 font-bold">
                        <Image
                          src="/assets/Images/star.png"
                          alt="reward"
                          className="w-4 h-4 rounded-full mr-1"
                          width={10}
                          height={10}
                          quality={100}
                        />
                        {task.reward}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Official Tasks Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-left text-white sm:text-base md:text-lg">
          Atrno Official Tasks
        </h2>
        <ul>
          {fetchLoading && !memoizedOfficialTasks.length ? (
            <SkeletonLoader count={3} />
          ) : (
            memoizedOfficialTasks?.map((task) => (
              <li
                className="mb-4"
                key={task._id}
                onClick={() => handleTaskClick(task, "official")}
              >
                <div className="flex justify-between items-center p-4 bg-secondary/20 text-white rounded-lg hover:bg-secondary/30 transition cursor-pointer">
                  <div className="flex items-center">
                    <Image
                      src={memoizedSocialImages[task?.platform || ""]}
                      alt={task?.platform}
                      className="w-10 h-10 object-cover rounded-full mr-4"
                      style={{
                        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
                      }}
                      width={20}
                      height={20}
                      quality={100}
                    />
                    <div>
                      <h3 className="text-sm">{task?.title}</h3>
                      <div className="flex items-center text-xs text-yellow-300 font-bold">
                        <Image
                          src="/assets/Images/star.png"
                          alt="reward"
                          className="w-4 h-4 rounded-full mr-1"
                          width={10}
                          height={10}
                          quality={100}
                        />
                        {task.reward}
                      </div>
                    </div>
                  </div>
                  {task?._id ===
                  member?.officialTask?.find(
                    (officialTask) => officialTask.taskId === task?._id
                  )?.taskId ? (
                    <Image
                      src="/assets/Images/green-tick.png"
                      alt="reward"
                      className="w-4 h-4 rounded-full mr-1"
                      width={10}
                      height={10}
                      quality={100}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Task Modal */}
      {isModalOpen && selectedTask && (
        <TaskModal task={selectedTask} onClose={closeModal} type={type} />
      )}
    </div>
  );
};

export default TaskList;
