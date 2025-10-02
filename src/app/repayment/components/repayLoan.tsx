"use client";

import { Modal } from "@/components/modal";
import { RepayLoanRequest } from "@/models/request/loan-request";
import { useRepayLoanMutation } from "@/services/loan-service";
import { useState } from "react";
import toast from "react-hot-toast";

interface RepayLoanProps {
  open: boolean;
  onClose: () => void;
  refetch: any;
  selectedLoan: any;
}

const RepayLoan: React.FC<RepayLoanProps> = ({
  open,
  onClose,
  refetch,
  selectedLoan,
}) => {
  const [formData, setFormData] = useState<RepayLoanRequest>({
    amount: 0,
    payment_date: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [repayLoan, { isLoading }] = useRepayLoanMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await repayLoan({
        body: formData,
        loanId: selectedLoan.id,
      }).unwrap();
      const { message } = response;
      toast.success(message || "Loan repay successfully");
      onClose();
      refetch();
    } catch (error: any) {
      console.error("Sign Up failed:", error);
      toast.error(
        error?.data?.message || "Loan approved failed. Please try again."
      );
    }
  };

  return (
    <div>
      {" "}
      <Modal
        open={open}
        onClose={onClose}
        title="Loan Disbursement"
        size="lg"
        buttons={[
          {
            label: "Cancel",
            onClick: onClose,
            className: "bg-red-500 text-white hover:bg-red-600",
          },
          {
            label: "Repay",
            type: "submit",
            onClick: handleSubmit,
            className:
              "bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-600 text-white",
          },
        ]}
      >
        <form className="space-y-4">
          <div>
            <div className="grid md:grid-cols-2 pb-4 gap-4"></div>
            <div>
              <label
                htmlFor="fullname"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Amount
              </label>
              <input
                type="number"
                name="amount"
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="fullname"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Payment Date
              </label>
              <input
                type="date"
                name="payment_date"
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RepayLoan;
