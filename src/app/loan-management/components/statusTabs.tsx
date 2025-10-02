"use client";

import { Tab, TabGroup, TabList } from "@headlessui/react";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type LoanStatus =
  | "all"
  | "registered"
  | "captured"
  | "approved"
  | "disbursed"
  | "active"
  | "completed"
  | "defaulted";

interface StatusTabsProps {
  selectedStatus: LoanStatus;
  onChange: (status: LoanStatus) => void;
}

const statuses: LoanStatus[] = [
  "all",
  "registered",
  "captured",
  "approved",
  "disbursed",
  "active",
  "completed",
  "defaulted",
];

const StatusTabs: React.FC<StatusTabsProps> = ({
  selectedStatus,
  onChange,
}) => {
  return (
    <TabGroup
      selectedIndex={statuses.indexOf(selectedStatus)}
      onChange={(index) => onChange(statuses[index])}
    >
      <TabList className="flex flex-wrap gap-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
        {statuses.map((status) => (
          <Tab key={status} as={Fragment}>
            {({ selected }) => (
              <button
                className={classNames(
                  "px-4 py-2 text-sm font-medium rounded-md capitalize",
                  selected
                    ? "bg-gray-800 text-white dark:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
                )}
              >
                {status}
              </button>
            )}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
};

export default StatusTabs;
