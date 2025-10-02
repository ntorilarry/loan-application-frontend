"use client";

import React from "react";

const DashboardCards = ({ data }) => {
  return (
    <div>
      {" "}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Total Loans
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.total_loans}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Active Loans
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.active_loans}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Completed Loans
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.completed_loans}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Defaulted Loans
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.defaulted_loans}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Total Disbursed
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.total_disbursed}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Total Collected
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.total_collected}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Pending Approvals
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.pending_approvals}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white border border-gray-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Pending Disbursement
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {data.pending_disbursements}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
