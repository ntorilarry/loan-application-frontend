"use client";

import Loader from "@/components/loader";
import { ForgotPasswordRequest } from "@/models/request/auth-request";
import { useForgotPasswordMutation } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";

const ForgotPassword = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<ForgotPasswordRequest>({
    email: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [userForgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await userForgotPassword(formData).unwrap();
      const { message } = response;
      toast.success(
        message ||
          "Reset password link has successfully sent to your email address"
      );
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-[#A8CBF0] p-1">
      <div className="grid lg:grid-cols-3">
        {/* Left side - Hero section */}
        <div className="lg:col-span-2 relative  bg-gray-900 flex items-end p-8 lg:p-12 min-h-[40vh] lg:min-h-screen rounded-2xl">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl"
            style={{
              backgroundImage: "url(/images/img_loginbg.png)",
            }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-2xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-white max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              LoanDrift - Loan Management System
            </h1>
            <p className="text-sm text-white/90 mb-8 leading-relaxed">
              Manage and track your loans with ease using LoanDrift, the
              ultimate loan management system.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1  bg-gray-50 flex items-center justify-center p-4 md:8 lg:p-16 rounded-2xl">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl  font-semibold text-gray-900 mb-2">
                Forgot Password
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your email and new password to reset your password.
              </p>
            </div>

            <form className="space-y-4">
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
                  onChange={handleInputChange}
                  placeholder="someone@example.com"
                  className="w-full px-4 py-3 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              {/* Sign in button */}
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-gray-900 mt-2 text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <span> {isLoading ? <Loader /> : "Forgot Password"}</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
