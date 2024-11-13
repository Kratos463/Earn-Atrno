"use client"

import CreateOfficialTask from "@/components/Tasks/create-official-task";
import OfficialTaskTable from "@/components/Tasks/OfficialTaskList";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const OfficialTask = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Official Task" />
            <CreateOfficialTask />
            <OfficialTaskTable />
        </DefaultLayout>
    );
};

export default OfficialTask;