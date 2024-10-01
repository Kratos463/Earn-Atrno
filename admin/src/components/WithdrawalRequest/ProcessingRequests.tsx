import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { fetchProcessingWithdrawalRequests, updateWithdrawalRequest, sendWithdrawal } from '@/Redux/User';
import { format } from 'date-fns';

interface Request {
    _id: string;
    userDetails: {
        username: string;
    };
    amount: number;
    requestDate: string;
    walletAddress: string;
    status: string;
    sendingAmount: number;
}

interface SendWithdrawalRequest {
    requestId: string;
    transactionHash: string;
}

interface RootState {
    user: {
        processingrequests: Request[];
        isLoading: boolean;
        error: string | null;
    };
}

const ProcessingWithdrawalRequestTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { processingrequests: requests, isLoading, error } = useAppSelector((state) => state.user);
    const [status, setStatus] = useState<Record<string, string>>({});
    const [transactionHash, setTransactionHash] = useState<Record<string, string>>({});
    
    useEffect(() => {
        dispatch(fetchProcessingWithdrawalRequests());
    }, [dispatch]);

    useEffect(() => {
        if (requests) {
            const initialStatus = requests.reduce((acc: Record<string, string>, request) => {
                acc[request._id] = request.status;
                return acc;
            }, {});
            const initialHash = requests.reduce((acc: Record<string, string>, request) => {
                acc[request._id] = ''; // Initialize with empty string or default value
                return acc;
            }, {});
            setStatus(initialStatus);
            setTransactionHash(initialHash);
        }
    }, [requests]);

    const handleStatusChange = (requestId: string, newStatus: string) => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            [requestId]: newStatus,
        }));

        dispatch(updateWithdrawalRequest({ withdrawalId: requestId, status: newStatus }))
            .unwrap()
            .then(() => {
                dispatch(fetchProcessingWithdrawalRequests());
            })
            .catch((error) => {
                console.error("Failed to update withdrawal request status:", error);
            });
    };

    const handleTransfer = async (requestId: string) => {
        if (transactionHash[requestId]) {
            try {
                const formData: SendWithdrawalRequest = {
                    requestId,
                    transactionHash: transactionHash[requestId],
                };

                const resultAction = await dispatch(sendWithdrawal(formData)).unwrap();
                if (resultAction.success) {
                    dispatch(fetchProcessingWithdrawalRequests());
                }
            } catch (error) {
                console.error("Failed to send withdrawal:", error);
            }
        }
    };

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Withdrawal Request List
            </h4>
            <div className="max-w-full overflow-x-auto">
                {requests.length > 0 ? (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                    Request Details
                                </th>
                                <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                                    Amount
                                </th>
                                <th className="min-w-[250px] px-4 py-4 font-medium text-black dark:text-white">
                                    Dates
                                </th>
                                <th className="px-4 py-4 font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                                    Wallet Address
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {request._id}
                                        </h5>
                                        <p className="text-sm">UID: {request.userDetails.username}</p>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <p className="text-success font-medium">{request.sendingAmount} USDT</p>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <p className="text-black text-sm dark:text-white">
                                            Request On: {format(new Date(request.requestDate), "dd MMM yyyy hh:mm a")}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{status[request._id]}</p>
                                        <select
                                            value={status[request._id]}
                                            onChange={(e) => handleStatusChange(request._id, e.target.value)}
                                            className="mt-2 p-1 rounded border-[1.5px] border-stroke bg-transparent text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                                        <p className="text-black dark:text-white">{request.walletAddress}</p>
                                        <div className="flex mt-1">
                                            <input
                                                type="text"
                                                placeholder="Enter Transaction Hash"
                                                className="p-1 w-50 rounded border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mr-1"
                                                value={transactionHash[request._id] || ''}
                                                onChange={(e) => setTransactionHash(prev => ({
                                                    ...prev,
                                                    [request._id]: e.target.value
                                                }))}
                                            />
                                            <button
                                                className="bg-primary text-white py-1 px-3 rounded-md font-medium hover:bg-opacity-90 transition"
                                                onClick={() => handleTransfer(request._id)}
                                            >
                                                {isLoading ? "Sending..." : "Send"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No processing withdrawal requests found.</p>
                )}
            </div>
        </div>
    );
};

export default ProcessingWithdrawalRequestTable;
