"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CreateDailyLoginReward from "@/components/Tasks/create-daily-login-reward";
import DailyLoginRewardTable from "@/components/Tasks/daily-login-reward-list";

const DailyLoginReward = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Daily Login Reward Task" />
            <div className="flex gap-3">
            <CreateDailyLoginReward />
            <DailyLoginRewardTable />
            </div>
        </DefaultLayout>
    );
};

export default DailyLoginReward;