
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { fetchOfficialTasks } from '@/Redux/Tasks'
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit  } from "@fortawesome/free-solid-svg-icons";

const OfficalTaskTable = () => {
  const dispatch = useAppDispatch();
  const { fetchLoading, officialTasks, error } = useAppSelector((state) => state.task);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchOfficialTasks());
  }, [dispatch]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTasks = officialTasks?.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-black dark:text-white">
          Official Task List
        </h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Title"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-stroke dark:border-strokedark rounded-md p-2"
          />
        </div>
      </div>
      {<p>{error}</p>}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-sm">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[80px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Icon
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Title/URL
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Username
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
            {filteredTasks?.map((task) => (
              <tr key={task._id}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center gap-3">
                    {task.icon ? (
                      <Image
                        src={`https://atrnoarenaapi.aeternus.foundation/${task.icon}`}
                        alt="icon"
                        width={42}
                        height={42}
                        className="rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    )}
                  </div>
                </td>
                <td className="flex border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11 gap-3 items-center">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {task.title}
                    </h5>
                    <p className="text-xs overflow-hidden">URL: {task.url}</p>
                  </div>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <p className="text-black dark:text-white text-xs">{task.username}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                  <p className="text-black font-medium dark:text-white text-xs">{task.reward}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark gap-3 flex">
                                    <button>
                                        <FontAwesomeIcon icon={faEdit} className="text-warning"/>
                                    </button>
                                    <button>
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-red"/>
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

export default OfficalTaskTable;
