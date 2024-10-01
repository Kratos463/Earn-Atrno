"use client"

import CreateOfficialTask from "@/components/tasks/create-official-task";
import OfficialTaskTable from "@/components/tasks/OfficialTaskList";
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