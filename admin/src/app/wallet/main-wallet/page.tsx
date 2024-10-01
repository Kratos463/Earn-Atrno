"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { addorupdateWallet, fetchROISettings } from "@/Redux/User"; // Ensure this is correctly imported

const FormLayout = () => {
    const dispatch = useAppDispatch();
    const { isLoading, settings } = useAppSelector((state) => state.user);

    const [walletAddress, setWalletAddress] = useState<string>(settings?.walletAddress || '');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWalletAddress(e.target.value);
    };

    useEffect(() => {
        dispatch(fetchROISettings());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!walletAddress) {
            setError("Wallet address is required.");
            return;
        }

        setError(null);
        setSuccessMessage(null);

        try {
            const response = await dispatch(addorupdateWallet({ walletAddress })).unwrap();
            dispatch(fetchROISettings());
            setSuccessMessage("Wallet address updated successfully.");
        } catch (err) {
            setError("Failed to update wallet address. Please try again.");
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Main Wallet Setting" />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Update Wallet Address
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Wallet Address
                                    </label>
                                    <input
                                        value={walletAddress}
                                        type="text"
                                        name="address"
                                        onChange={handleChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default FormLayout;
