"use client";

import { Modal } from "@/components/modal";
import { ApproveLoanRequest } from "@/models/request/loan-request";
import { useApproveLoanMutation } from "@/services/loan-service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ApproveLoanProps {
  open: boolean;
  onClose: () => void;
  refetch: any;
  selectedLoan: any;
}

const ApproveLoan: React.FC<ApproveLoanProps> = ({
  open,
  onClose,
  refetch,
  selectedLoan,
}) => {
  const [formData, setFormData] = useState<ApproveLoanRequest>({
    approved_amount: 0,
    loan_duration: "",
    payment_mode: "",
    payment_start_date: "",
    payment_end_date: "",
    processing_fee: 0,
    interest_rate: 0,
  });

  useEffect(() => {
    if (selectedLoan) {
      setFormData({
        approved_amount: selectedLoan.registered.requested_amount || 0,
        loan_duration: selectedLoan.approved.loan_duration || "",
        payment_mode: selectedLoan.approved.payment_mode || "",
        payment_start_date: selectedLoan.approved.payment_start_date || "",
        payment_end_date: selectedLoan.approved.payment_end_date || "",
        processing_fee: selectedLoan.approved.processing_fee || 0,
        interest_rate: selectedLoan.approved.interest_rate || 0,
      });
    }
  }, [selectedLoan]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "payment_start_date" || name === "payment_end_date") {
        updated.loan_duration = calculateDuration(
          updated.payment_start_date,
          updated.payment_end_date
        );
      }

      return updated;
    });
  };

  const [approveLoan, { isLoading }] = useApproveLoanMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await approveLoan({
        body: formData,
        loanId: selectedLoan.id,
      }).unwrap();
      const { message } = response;
      toast.success(message || "Loan approved successfully");
      onClose();
      refetch();
    } catch (error: any) {
      console.error("Sign Up failed:", error);
      toast.error(
        error?.data?.message || "Loan approved failed. Please try again."
      );
    }
  };

  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return "";

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "";

    let diffInDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 0) return "";

    const months = Math.floor(diffInDays / 30);
    diffInDays %= 30;
    const weeks = Math.floor(diffInDays / 7);
    const days = diffInDays % 7;

    const parts: string[] = [];
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(" ") : "0 days";
  };

  return (
    <div>
      {" "}
      <Modal
        open={open}
        onClose={onClose}
        title="Loan Approval"
        size="lg"
        buttons={[
          {
            label: "Cancel",
            onClick: onClose,
            className: "bg-red-500 text-white hover:bg-red-600",
          },
          {
            label: "Approve",
            type: "submit",
            onClick: handleSubmit,
            className:
              "bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-600 text-white",
          },
        ]}
      >
        <form className="space-y-4">
          <div className="grid md:grid-cols-2  gap-4">
            <div>
              <label
                htmlFor="fullname"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Approved Amount
              </label>
              <input
                type="number"
                name="approved_amount"
                value={formData.approved_amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="payment_mode"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Payment Mode
              </label>
              <select
                name="payment_mode"
                value={formData.payment_mode  || ""}
                onChange={handleInputChange}
                className="px-4 py-3 mt-2 block w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-800 dark:border-white dark:text-white dark:placeholder-neutral-500"
                required
              >
                <option value="" disabled>
                  Select payment mode
                </option>

                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Payment Start Date
              </label>
              <input
                type="date"
                name="payment_start_date"
                value={formData.payment_start_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 border dark:text-white text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Payment End Date
              </label>
              <input
                type="date"
                name="payment_end_date"
                value={formData.payment_end_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 border dark:text-white text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Loan Duration
              </label>
              <input
                type="text"
                name="loan_duration"
                value={formData.loan_duration}
                onChange={handleInputChange}
                disabled
                className="w-full px-4 py-3 mt-2 border dark:text-white text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="interest_rate"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Interest Rate
              </label>
              <input
                type="text"
                name="interest_rate"
                value={formData.interest_rate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 border dark:text-white text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="processing_fee"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Processing Fee
              </label>
              <input
                type="text"
                name="processing_fee"
                value={formData.processing_fee}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 border dark:text-white text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApproveLoan;
