"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { fetchROISettings } from "@/Redux/User";
import { useEffect } from "react";

const FormLayout = () => {
    const dispatch = useAppDispatch();
    const { settings } = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchROISettings());
    }, []);

    const renderReferralRateInputs = () => {
        if (!settings?.referralCommissionRates) return null;

        return Object.entries(settings.referralCommissionRates).map(([level, rate], index) => (
            <div key={index} className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {level} Percentage
                </label>
                <input
                    value={rate}
                    type="number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => handleRateChange(level, e.target.value)}
                />
            </div>
        ));
    };

    const handleRateChange = (level: string, newRate: string) => {
        // Handle rate change logic here
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Settings" />

            <div className="grid grid-cols-1 gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Team Referral Setting
                        </h3>
                    </div>
                    <form action="#">
                        <div className="p-6.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {renderReferralRateInputs()}
                        </div>
                        <div className="px-6.5 pb-6.5">
                            <button
                                type="submit"
                                className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default FormLayout;
