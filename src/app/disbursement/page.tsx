"use client";

import MainLayout from "@/shared/mainLayout";
import React, { useState } from "react";
import { useListLoansQuery } from "@/services/loan-service";
import { useGlobalState } from "@/utils/globalStateContext";
import DataTableHeader from "@/components/dataTableHeader";
import DataTableBody from "@/components/dataTableBody";
import Image from "next/image";
import { ListLoanResponse } from "@/models/response/loan-response";
import ActionsDropdown from "@/components/actionsDropdown";
import { TbChecklist, TbEditCircle } from "react-icons/tb";
import ApproveLoan from "./components/disburseLoan";

const Disbursement = () => {
  const { searchQuery } = useGlobalState();
  const [openDisburse, setOpenDisburse] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ListLoanResponse | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: loanResponse,
    isLoading,
    refetch,
  } = useListLoansQuery({
    page: currentPage,
    limit: 10,
    status: "approved",
    search: searchQuery || "",
  });

  const listloans = loanResponse?.data || [];
  const pagination = loanResponse?.pagination;

  const columns = [
    {
      header: "Client Name",
      cell: ({ row }) => {
        const { client_name, client_email, client_contact } =
          row.original.registered;
        return (
          <div className="inline-flex items-center">
            <Image
              className="flex-shrink-0 object-cover w-8 h-8 mr-3 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                client_name || ""
              )}&background=random&size=40`}
              alt={client_name || ""}
              width={32}
              height={32}
            />
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {client_name || ""}
              </div>
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {client_contact || ""}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {client_email || "No Email"}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      header: "Location",
      cell: ({ row }: any) => {
        const { client_location, client_landmark } = row.original.registered;
        return (
          <div>
            <span className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {client_location}
            </span>
            <span className="block text-sm text-gray-600 dark:text-neutral-300">
              {client_landmark}
            </span>
          </div>
        );
      },
    },
    { header: "Requested Amount", accessorKey: "registered.requested_amount" },

    { header: "Business", accessorKey: "registered.client_business" },
    { header: "Status", accessorKey: "loan_status.status" },
    {
      header: "Date Created",
      accessorKey: "created_at",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const localDate = new Date(value).toLocaleString();
        return <span>{localDate}</span>;
      },
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: ListLoanResponse } }) => {
        const actions = [
          {
            label: "View",
            icon: <TbEditCircle className="flex-shrink-0 size-3.5" />,
            href: `/loan-management/${row.original.id}`,
          },
          {
            label: "Disburse",
            icon: <TbChecklist className="flex-shrink-0 size-3.5" />,
            onClick: () => handleDisbursement(row.original),
          },
        ];

        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDisbursement = (row: ListLoanResponse) => {
    setSelectedLoan(row);
    setOpenDisburse(true);
  };

  return (
    <MainLayout>
      <h2 className="text-lg font-medium text-neutral-600 dark:text-white ">
        Disbursement Phase
      </h2>
      <h2 className="text-sm font-normal dark:text-white mb-4 text-neutral-600">
        Manage Loan disbursement
      </h2>

      <div className="pt-6">
        <DataTableHeader title="Loan Disbursement" />

        <DataTableBody
          columns={columns}
          data={listloans}
          isLoading={isLoading}
          showPagination
          totalPages={pagination?.totalPages || 0}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        <ApproveLoan
          open={openDisburse}
          onClose={() => setOpenDisburse(false)}
          refetch={refetch}
          selectedLoan={selectedLoan}
        />
      </div>
    </MainLayout>
  );
};

export default Disbursement;
