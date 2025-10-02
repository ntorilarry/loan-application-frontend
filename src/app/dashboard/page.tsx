"use client";

import MainLayout from "@/shared/mainLayout";
import React from "react";
import DashboardCards from "./components/dashboardCards";
import { useListDashboardReportsQuery } from "@/services/report-service";
import Loader from "@/components/loader";
import MonthlyDisbursementChart from "./components/monthlyDisburseGraph";
import ActivityLog from "./components/activityLog";

const Dashboard = () => {
  const { data: dashboardResponse, isLoading } = useListDashboardReportsQuery();
  const dashData = dashboardResponse?.data;

  if (!dashData) {
    return <div>No dashboard data available</div>; // or just return null
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <MainLayout>
      <h2 className="text-xl font-semibold dark:text-white mb-4">Dashboard</h2>
      <DashboardCards data={dashData} />
      <div className="grid lg:grid-cols-2 gap-4 py-4">
        {" "}
        <MonthlyDisbursementChart dashData={dashData} />
        <ActivityLog dashData={dashData} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
