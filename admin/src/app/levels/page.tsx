"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LevelTable from "@/components/Levels/Levels-list";
import CreateLevels from "@/components/Levels/Create-level";

const Rewards = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Levels" />
            <CreateLevels />
            <LevelTable />
        </DefaultLayout>
    );
};

export default Rewards;
