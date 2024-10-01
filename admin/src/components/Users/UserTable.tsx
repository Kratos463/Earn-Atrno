import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { fetchUsers } from "@/Redux/User";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import DefaultLayout from "../Layouts/DefaultLayout";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Flag from 'react-world-flags';

const UserTable = () => {
  const dispatch = useAppDispatch();
  const { members, pagination, error } = useAppSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByJoinDate, setFilterByJoinDate] = useState('newest');
  const limit = 20;

  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [dispatch, page]);


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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByJoinDate(e.target.value);
  };


  const filteredUsers = members?.filter(user =>
  (user.userId.includes(searchTerm) || user.referralCode.includes(searchTerm))
  ).sort((a, b) => {
    if (filterByJoinDate === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users List" />
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-black dark:text-white">
            Users List ({pagination?.totalMembers})
          </h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by Name or UID"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-stroke dark:border-strokedark rounded-md p-2"
            />
            <select
              value={filterByJoinDate}
              onChange={handleFilterChange}
              className="border border-stroke dark:border-strokedark rounded-md p-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        {<p>{error}</p>}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="text-sm">
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Wallet Address/Id
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Coins
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Join on
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers?.map((user) => (
                <tr key={user._id}>
                  <td className="flex border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11 gap-3 items-center">
                    <Flag code={user.country} className="w-10 h-10" />
                   <div>
                   <h5 className="font-medium text-xs text-black dark:text-white">
                      {user.userId}
                    </h5>
                    <p className="text-xs">ID: {user.referralCode}</p>
                   </div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white text-xs">{user?.wallet?.coins?.toLocaleString()}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white text-xs">
                      {format(new Date(user.createdAt), "dd MMM yyyy hh:mm a")}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                    <p className="text-green font-medium text-xs">{user.accountStatus}</p>
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
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:bg-gray-200"
            onClick={handleNextPage}
            disabled={page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserTable;
