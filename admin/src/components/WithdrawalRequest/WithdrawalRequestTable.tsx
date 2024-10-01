import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { fetchWithdrawalRequests, updateWithdrawalRequest } from "@/Redux/User";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Request {
    _id: string;
    userDetails: {
        username: string;
    };
    withdrawalRequestDetails: {
        amount: number,
        requestDate: string,
        sendingAmount: number,
        completedDate: string,
        status: string,
        walletAddress: string
    },
    transactionHash: any,   
}

interface RootState {
    user: {
        requests: Request[];
    };
}

const WithdrawalRequestTable = () => {
    const dispatch = useAppDispatch();
    const requests = useAppSelector((state) => state.user.requests);

    useEffect(() => {
        dispatch(fetchWithdrawalRequests());
    }, [dispatch]);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Withdrawal Request List
            </h4>
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                Request Details
                            </th>
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                Amount
                            </th>
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                Dates
                            </th>
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:p1-11">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {requests?.map((request) => (
                            <tr key={request._id}>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {request._id}
                                    </h5>
                                    <p className="text-sm">UID: {request.userDetails.username}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                                    <p className="font-medium">Req Amount: {request.withdrawalRequestDetails.amount} USDT</p>
                                    <p className="font-medium">Sent Amount: {request.withdrawalRequestDetails.sendingAmount} USDT</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                                    <p className="text-black text-sm dark:text-white">
                                        Request On: {format(new Date(request.withdrawalRequestDetails.requestDate), "dd MMM yyyy hh:mm a")}
                                    </p>
                                    <p className="text-black text-sm dark:text-white">
                                        Completed On: {format(new Date(request.withdrawalRequestDetails.completedDate), "dd MMM yyyy hh:mm a")}
                                    </p>
                                    
                                </td>
            
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                                    <p className="text-black dark:text-white">Address: {request.withdrawalRequestDetails.walletAddress}</p>
                                    <p className="text-black dark:text-white">Hash: {request.transactionHash}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WithdrawalRequestTable;
