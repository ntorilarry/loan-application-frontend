"use client";

import DataTableBody from "@/components/dataTableBody";
import React from "react";

const ActivityLog = ({ dashData }) => {
  const logs = dashData.recent_activities || [];
  const slicedLogs = logs.slice(0, 10); // ✅ only take the first 5

  const columns = [
    { header: "Username", accessorKey: "user_name" },
    {
      header: "Date Created",
      accessorKey: "created_at",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const localDate = new Date(value).toLocaleString();
        return <span>{localDate}</span>;
      },
    },
    { header: "Action", accessorKey: "action" },
  ];

  return (
    <div>
      <h2 className="text-base dark:text-white my-4">Activity Logs</h2>
      <DataTableBody columns={columns} data={slicedLogs} isLoading={false} />
    </div>
  );
};

export default ActivityLog;
