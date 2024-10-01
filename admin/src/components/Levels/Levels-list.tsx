import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { fetchLevels, } from "@/Redux/Levels";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import {formatNumber} from '@/utils'

const LevelTable = () => {
    const dispatch = useAppDispatch();
    const { levels, pagination, isLoading, error } = useAppSelector((state) => state.level);
    const [searchTerm, setSearchTerm] = useState('');

    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        dispatch(fetchLevels({ page, limit }));
    }, [page, dispatch]);

    const handleNextPage = () => {
        if (page < pagination.totalPages) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      };

      const filteredLevels = levels?.filter(level =>
        level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        level.levelNumber.toString().includes(searchTerm)
      ) || [];
      
    

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-black dark:text-white">
                    Levels List ({pagination?.totalLevels})
                </h3>
                <input
                    type="text"
                    placeholder="Search by name or number"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border border-stroke dark:border-strokedark rounded-md p-2"
                />
            </div>
            {<p>{error}</p>}
            <div className="w-full">
                <table className="w-full table-auto">
                    <thead className="text-sm">
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Image
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Number/Name 
                            </th>
                            <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                                Points
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                PowerUps
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Reward
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Achievers
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredLevels?.map((level) => (
                            <tr key={level._id}>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <div className="flex items-center gap-3">
                                        {level.character ? (
                                            <Image
                                                src={`https://atrnoarenaapi.aeternus.foundation/${level?.character}`}
                                                alt="character"
                                                width={42}
                                                height={42}
                                                className="rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                        )}
                                    </div>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white font-medium text-xs">{level.levelNumber}. {level.name}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-xs">Min: {formatNumber(level.minimumPoints)}</p>
                                    <p className="text-black dark:text-white text-xs">Max: {formatNumber(level.maximumPoints)}</p>
                                </td>
                 
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-xs">Tap: {level.powerUps.onTap}</p>
                                    <p className="text-black dark:text-white text-xs">Energy: {level.powerUps.energy}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                <p className="text-black dark:text-white text-xs">{formatNumber(level.reward)}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                <p className="text-black dark:text-white text-xs">{formatNumber(level.totalAchievers)}</p>
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
            <div className="mt-4 flex justify-between">
                <button
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:bg-gray-200"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>
                    Page {pagination?.currentPage} of {pagination?.totalPages}
                </span>
                <button
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:bg-gray-200"
                    onClick={handleNextPage}
                    disabled={page === pagination?.totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default LevelTable;
