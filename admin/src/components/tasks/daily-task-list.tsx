import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { fetchDailyTasks } from "@/Redux/Tasks";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";

const DailyTaskTable = () => {
  const dispatch = useAppDispatch();
  const { dailyTasks, error } = useAppSelector((state) => state.task);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDailyTasks());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTasks =
    dailyTasks?.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.platform.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="mt-5 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-medium text-black dark:text-white">
          Daily Task List
        </h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Title"
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
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Title/URL
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Username/Platform
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Reward Amount
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Expiry On
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredTasks?.map((task) => (
              <tr key={task._id}>
                <td className="flex items-center gap-3 border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {task.title}
                    </h5>
                    <p className="overflow-hidden text-xs">URL: {task.url}</p>
                  </div>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <p className="text-xs text-black dark:text-white">
                    {task.username}
                  </p>
                  <p className="text-xs">PT: {task.platform}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <p className="text-xs font-medium text-black dark:text-white">
                    {task.reward}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <p className="text-xs font-medium text-black dark:text-white">
                    {format(new Date(task?.expiryOn), "dd MMM yyyy hh:mm a")}
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

export default DailyTaskTable;
