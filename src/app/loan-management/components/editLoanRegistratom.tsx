"use client";

import { Modal } from "@/components/modal";
import { RegisterLoanRequest } from "@/models/request/loan-request";
import { useEditLoanRegistrationMutation } from "@/services/loan-service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EditLoanRegistrationProps {
  open: boolean;
  onClose: () => void;
  refetch: any;
  selectedLoan: any;
}

const EditLoanRegistration: React.FC<EditLoanRegistrationProps> = ({
  open,
  onClose,
  refetch,
  selectedLoan,
}) => {
  const [formData, setFormData] = useState<RegisterLoanRequest>({
    fullname: "",
    contact: "",
    email: "",
    location: "",
    landmark: "",
    business: "",
    requested_amount: 0,
  });

  useEffect(() => {
    if (selectedLoan) {
      setFormData({
        fullname: selectedLoan.registered.client_name || "",
        contact: selectedLoan.registered.client_contact || "",
        email: selectedLoan.registered.client_email || "",
        location: selectedLoan.registered.client_location || "",
        landmark: selectedLoan.registered.client_landmark || "",
        business: selectedLoan.registered.client_business || "",
        requested_amount: selectedLoan.registered.requested_amount || 0,
      });
    }
  }, [selectedLoan]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [editLoan, { isLoading }] = useEditLoanRegistrationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await editLoan({
        body: formData,
        loanId: selectedLoan.id,
      }).unwrap();
      const { message } = response;
      toast.success(message || "Loan registration Updated");
      onClose();
      refetch();
    } catch (error: any) {
      console.error("Sign Up failed:", error);
      toast.error(error?.data?.message || "Sign Up failed. Please try again.");
    }
  };
  return (
    <div>
      {" "}
      <Modal
        open={open}
        onClose={onClose}
        title="Register Loan"
        size="xl"
        buttons={[
          {
            label: "Cancel",
            onClick: onClose,
            className: "bg-red-500 text-white hover:bg-red-600",
          },
          {
            label: "Save",
            type: "submit",
            onClick: handleSubmit,
            className:
              "bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-600 text-white",
          },
        ]}
      >
        <form className="space-y-4">
          <div className="grid  md:grid-cols-2  gap-4">
            <div>
              <label
                htmlFor="fullname"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 mt-2 dark:text-white  border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Email Address
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="someone@example.com"
                className="w-full px-4 py-3 mt-2 border dark:text-white text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="grid  md:grid-cols-2  gap-4">
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Phone
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 border text-sm dark:text-white border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="requested_amount"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Requested Amount
              </label>
              <input
                type="number"
                name="requested_amount"
                value={formData.requested_amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 border text-sm dark:text-white border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="text-sm font-normal dark:text-white pb-4"
            >
              Location
            </label>
            <textarea
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleInputChange}
              rows={3}
              required
              className="mt-2 border block w-full px-4 py-3 text-sm dark:text-white placeholder-gray-500 border-gray-300 rounded-lg  dark:placeholder-gray-300 "
            />
          </div>
          <div className="grid  md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="landmark"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Landmark{" "}
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full px-4 py-3 mt-2 dark:text-white border text-sm border-gray-300 rounded-lg  text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="business"
                className="text-sm font-normal dark:text-white pb-4"
              >
                Business
              </label>
              <input
                type="text"
                name="business"
                value={formData.business}
                onChange={handleInputChange}
                placeholder=""
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

export default EditLoanRegistration;
