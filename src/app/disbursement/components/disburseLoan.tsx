"use client";

import { Modal } from "@/components/modal";
import { DisburseLoanRequest } from "@/models/request/loan-request";
import { useDisburseLoanMutation } from "@/services/loan-service";
import { useState } from "react";
import toast from "react-hot-toast";

interface DisburseLoanProps {
  open: boolean;
  onClose: () => void;
  refetch: any;
  selectedLoan: any;
}

const DisburseLoan: React.FC<DisburseLoanProps> = ({
  open,
  onClose,
  refetch,
  selectedLoan,
}) => {
  const [formData, setFormData] = useState<DisburseLoanRequest>({
    disbursement_method: "",
    disbursement_notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [disburseLoan, { isLoading }] = useDisburseLoanMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await disburseLoan({
        body: formData,
        loanId: selectedLoan.id,
      }).unwrap();
      const { message } = response;
      toast.success(message || "Loan disburse successfully");
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
            label: "Disburse",
            type: "submit",
            onClick: handleSubmit,
            className:
              "bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-600 text-white",
          },
        ]}
      >
        <form className="space-y-4">
          <div>
            <div className="grid md:grid-cols-2 pb-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Approved Amount
                </label>
                <p className="text-lg font-semibold text-foreground">
                  {selectedLoan?.approved?.approved_amount || 0}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Loan Duration
                </label>
                <p className="text-lg font-semibold text-foreground">
                 {selectedLoan?.approved?.loan_duration || ""}
                </p>
              </div>
            </div>
            <div>
              <label
                htmlFor="disbursement_method"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Disbursement Method
              </label>
              <select
                name="disbursement_method"
                onChange={handleInputChange}
                className="px-4 py-3 mt-2 block w-full border border-gray-200 rounded-lg text-sm dark:bg-neutral-800 dark:border-white dark:text-white dark:placeholder-neutral-500"
                required
              >
                <option value="" disabled>
                  Select disbursement method
                </option>

                <option value="mobile_money">Mobile Money</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="disbursement_notes"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Disbursement notes
              </label>
              <textarea
                name="disbursement_notes"
                onChange={handleInputChange}
                rows={3}
                required
                className="mt-2 border block w-full px-4 py-3 text-sm dark:text-white placeholder-gray-500 border-gray-300 rounded-lg  dark:placeholder-gray-300 "
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DisburseLoan;
