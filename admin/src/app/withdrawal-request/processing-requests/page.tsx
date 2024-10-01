"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProcessingWithdrawalRequestTable from "@/components/WithdrawalRequest/ProcessingRequests";


const ProcessingRequestsPage = () => {
  return (
    <DefaultLayout>
          <Breadcrumb pageName="Processing Request" />
      <ProcessingWithdrawalRequestTable />
    </DefaultLayout>
  );
};

export default ProcessingRequestsPage;