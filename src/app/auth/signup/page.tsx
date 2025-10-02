"use client";

import Loader from "@/components/loader";
import { SignUpRequest } from "@/models/request/auth-request";
import { useSignupMutation } from "@/services/auth-service";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignUpRequest>({
    email: "",
    password: "",
    fullname: "",
    phone: "",
    company_name: "",
    company_address: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [userSignup, { isLoading }] = useSignupMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await userSignup(formData).unwrap();
      const { message } = response;
      toast.success(message || "SignUp successful!");
      router.push("/auth/confirmation-email");
    } catch (error: any) {
      console.error("Sign Up failed:", error);
      toast.error(error?.data?.message || "Sign Up failed. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-[#A8CBF0] p-1">
      <div className="grid lg:grid-cols-3">
        {/* Left side - Hero section */}
        <div className="lg:col-span-1 relative  bg-gray-900 flex items-end p-8 lg:p-12 min-h-[40vh] lg:min-h-screen rounded-2xl">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl"
            style={{
              backgroundImage: "url(/images/img_signupbg.png)",
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

        {/* Right side - Login form */}
        <div className="lg:col-span-2  bg-gray-50 flex items-center justify-center p-4 md:8 lg:p-16 rounded-2xl">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <h2 className="text-3xl  font-semibold text-gray-900 mb-2">
                Sign Up
              </h2>
              <p className="text-gray-600 text-sm">
                Create an account to manage your loans effectively.
              </p>
            </div>

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
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 mt-2  border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
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
                    onChange={handleInputChange}
                    placeholder="someone@example.com"
                    className="w-full px-4 py-3 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-normal dark:text-white pb-4"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    onChange={handleInputChange}
                    placeholder="+233"
                    className="w-full px-4 py-3 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="companyName"
                    className="text-sm font-normal dark:text-white pb-4"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    onChange={handleInputChange}
                    placeholder="Example Ltd"
                    className="w-full px-4 py-3 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="companyAddress"
                  className="text-sm font-normal dark:text-white pb-4"
                >
                  Company Address
                </label>
                <textarea
                  name="company_address"
                  placeholder="Enter description"
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="mt-2 border block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-lg dark:text-white dark:bg-neutral-700 dark:placeholder-gray-300 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm caret-indigo-600"
                />
              </div>

              {/* Password input */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-sm font-normal dark:text-white pb-4"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 mt-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                  required
                />
                {showPassword ? (
                  <FiEyeOff
                    className="absolute end-2.5 bottom-[0.95rem] text-gray-600 text-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FiEye
                    className="absolute end-2.5 bottom-[0.95rem] text-gray-600 text-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>

              {/* Sign in button */}
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-gray-900 mt-2 text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <span> {isLoading ? <Loader /> : "Sign Up"}</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
