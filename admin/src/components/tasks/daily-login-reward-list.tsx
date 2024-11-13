"use client"

import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { fetchDailyLoginRewardTasks } from "@/Redux/Tasks";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { formatNumber } from "@/utils";

const DailyLoginRewardTable = () => {
  const dispatch = useAppDispatch();
  const { dailyLoginRewardTasks, error } = useAppSelector(
    (state) => state.task,
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDailyLoginRewardTasks());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDailyLoginRewardTasks =
    dailyLoginRewardTasks?.filter((task) =>
      task.day.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="flex-1 rounded-sm border border-stroke bg-white px-5 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-medium text-black dark:text-white">
          Daily Login Reward List
        </h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Day"
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-md border border-stroke p-2 dark:border-strokedark"
          />
        </div>
      </div>
      {<p>{error}</p>}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-sm">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Day
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Reward Amount
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredDailyLoginRewardTasks?.map((task) => (
              <tr key={task._id}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <p className="text-xs text-black dark:text-white">
                    {task.day}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <p className="text-xs font-medium text-black dark:text-white">
                    {formatNumber(task?.rewardValue)}
                  </p>
                </td>
                <td className="flex gap-3 border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <button>
                    <FontAwesomeIcon icon={faEdit} className="text-warning" />
                  </button>
                  <button>
                    <FontAwesomeIcon icon={faTrashAlt} className="text-red" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyLoginRewardTable;
