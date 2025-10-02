"use client";

import MainLayout from "@/shared/mainLayout";
import React, { useState } from "react";
import LoanRegistrationCards from "./components/loanRegistrationCards";
import { useListLoansQuery } from "@/services/loan-service";
import { useGlobalState } from "@/utils/globalStateContext";
import DataTableHeader from "@/components/dataTableHeader";
import { IoMdAdd } from "react-icons/io";
import DataTableBody from "@/components/dataTableBody";
import AddLoanRegistration from "./components/addLoanRegistration";
import Image from "next/image";
import { ListLoanResponse } from "@/models/response/loan-response";
import CaptureLoanDetails from "./components/captureLoanDetails";
import ActionsDropdown from "@/components/actionsDropdown";
import { TbCapture, TbEditCircle } from "react-icons/tb";
import StatusTabs, { LoanStatus } from "./components/statusTabs";
import EditLoanRegistration from "./components/editLoanRegistratom";

const LoanRegistration = () => {
  const { searchQuery } = useGlobalState();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCapture, setOpenCapture] = useState(false);
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
    status: "",
    search: searchQuery || "",
  });

  const listloans = loanResponse?.data || [];
  const pagination = loanResponse?.pagination;
  const stats = loanResponse?.stats;

  const columns = [
    {
      header: "Client Name",
      cell: ({ row }) => {
        const { client_name, client_email, client_contact } = row.original.registered;
        return (
          <div className="inline-flex items-center">
            <Image
              className="flex-shrink-0 object-cover w-8 h-8 mr-3 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                client_name
              )}&background=random&size=40`}
              alt={client_name}
              width={32}
              height={32}
            />
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {client_name}
              </div>
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {client_contact}
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
        const loan = row.original;
        const restrictedStatuses = [
          "approved",
          "disbursed",
          "active",
          "completed",
          "defaulted",
        ];

        // 👇 explicitly type this array
        const actions: {
          label: string;
          icon: React.ReactNode;
          onClick?: () => void;
          href?: string;
        }[] = [];

        actions.push({
          label: "View",
          icon: <TbEditCircle className="flex-shrink-0 size-3.5" />,
          href: `/loan-management/${loan.id}`,
        });

        if (!restrictedStatuses.includes(loan.loan_status.status.toLowerCase())) {
          actions.push({
            label: "Edit",
            icon: <TbEditCircle className="flex-shrink-0 size-3.5" />,
            onClick: () => handleEdit(loan),
          });
          actions.push({
            label: "Capture",
            icon: <TbCapture className="flex-shrink-0 size-3.5" />,
            onClick: () => handleCapture(loan),
          });
        }

        return <ActionsDropdown actions={actions} />;
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleCapture = (row: ListLoanResponse) => {
    setSelectedLoan(row);
    setOpenCapture(true);
  };

  const handleEdit = (row: ListLoanResponse) => {
    setSelectedLoan(row);
    setOpenEdit(true);
  };

  const [selectedStatus, setSelectedStatus] = useState<LoanStatus>("all");

  // Assuming `listloans` is your full loan list
  const filteredLoans =
    selectedStatus === "all"
      ? listloans
      : listloans.filter((loan) => loan.loan_status.status === selectedStatus);
  return (
    <MainLayout>
      <h2 className="text-lg font-medium text-neutral-600 dark:text-white ">
        Registration Phase
      </h2>
      <h2 className="text-sm font-normal dark:text-white mb-4 text-neutral-600">
        Manage Loan registrations
      </h2>
      <LoanRegistrationCards stats={stats} />
      <div className="pt-6">
        <DataTableHeader
          title="Loan Registration"
          buttons={[
            {
              label: "Add Registration",
              onClick: handleAdd,
              icon: <IoMdAdd />,
              className:
                "bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-600 text-white",
            },
          ]}
        />
        <StatusTabs
          selectedStatus={selectedStatus}
          onChange={setSelectedStatus}
        />
        <DataTableBody
          columns={columns}
          data={filteredLoans}
          isLoading={isLoading}
          showPagination
          totalPages={pagination?.totalPages || 0}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        <AddLoanRegistration
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          refetch={refetch}
        />

        <EditLoanRegistration
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          refetch={refetch}
          selectedLoan={selectedLoan}
        />

        <CaptureLoanDetails
          open={openCapture}
          onClose={() => setOpenCapture(false)}
          refetch={refetch}
          selectedLoan={selectedLoan}
        />
      </div>
    </MainLayout>
  );
};

export default LoanRegistration;
