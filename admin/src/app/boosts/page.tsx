"use client";

import CreateEnergyBooster from "@/components/Boosts/Create-Energy-Boost";
import CreateTapBooster from "@/components/Boosts/Create-Tap-Boost";
import EnergyBoostTable from "@/components/Boosts/Energy-Boost-List";
import TapBoostTable from "@/components/Boosts/Tap-Boost-List";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const Boosts = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Boosts" />
      <div className="flex sm:flex-row gap-3">
        <CreateEnergyBooster />
        <CreateTapBooster />
      </div>
      <div className="flex gap-3 h-fit">
        <EnergyBoostTable />
        <TapBoostTable />
      </div>
    </DefaultLayout>
  );
};

export default Boosts;
