"use client";

import React from "react";

const LoanRegistrationCards = ({ stats }) => {
  return (
    <div>
      {" "}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="flex flex-col bg-white border border-neutral-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Total Registrations
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-neutral-800 dark:text-neutral-200">
                {stats?.total_registrations}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white border border-neutral-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Registered
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-neutral-800 dark:text-neutral-200">
                {stats?.registered}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white border border-neutral-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Captured
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-neutral-800 dark:text-neutral-200">
                {stats?.captured}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white border border-neutral-300 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase text-neutral-700 dark:text-neutral-300">
                Total Requested
              </p>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-neutral-800 dark:text-neutral-200">
                GHC {stats?.total_requested}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRegistrationCards;
