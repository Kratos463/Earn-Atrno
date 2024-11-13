"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CreateDailyTask from "@/components/Tasks/create-daily-task";
import DailyTaskTable from "@/components/Tasks/daily-task-list";

const DailyTask = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Daily Task" />
            <CreateDailyTask />
            <DailyTaskTable />
        </DefaultLayout>
    );
};

export default DailyTask;