"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WithdrawalRequestTable from "@/components/WithdrawalRequest/WithdrawalRequestTable";

const CalendarPage = () => {
  return (
    <DefaultLayout>
       <Breadcrumb pageName="All Withdrawal Request" />
      <WithdrawalRequestTable />
    </DefaultLayout>
  );
};

export default CalendarPage;