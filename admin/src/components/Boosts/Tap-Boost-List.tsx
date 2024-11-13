import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import {formatNumber} from '@/utils'
import { fetchBoosts } from "@/Redux/Booster";

const TapBoostTable = () => {
    const dispatch = useAppDispatch();
    const { tapBoosts, pagination, isLoading, error } = useAppSelector((state) => state.booster);
    const [searchTerm, setSearchTerm] = useState('');

    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        dispatch(fetchBoosts({ type: "tap", page, limit }));
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

      const filteredBoosts = tapBoosts?.filter(boost =>
        boost?.level.toString().includes(searchTerm)
      ) || [];
      
    console.log("EnergyBoosts", tapBoosts)

    return (
        <div className="flex-1 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-black dark:text-white">
                    Tap Boost List ({pagination?.totalBoosts})
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
                                Level Number
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Boost Cost
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Tap Boost
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredBoosts?.map((boost) => (
                            <tr key={boost._id}>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white font-medium text-xs">{boost.level}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white font-medium text-xs">{formatNumber(boost?.cost || 0)}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white font-medium text-xs">{boost.tap}</p>
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

export default TapBoostTable;
