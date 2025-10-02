"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Loader from "@/components/loader";
import { useResetPasswordMutation } from "@/services/auth-service";
import { ResetPasswordRequest } from "@/models/request/auth-request";

const PasswordReset = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null
  );

  const [formData, setFormData] = useState<ResetPasswordRequest>({
    token: token ?? "",
    password: "",
  });

  const [userResetPassword, { isLoading }] = useResetPasswordMutation();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await userResetPassword(formData).unwrap();
      const { message } = response;
      toast.success(message || "Reset Password successful!");

      // Start countdown
      setRedirectCountdown(5);
    } catch (error: any) {
      console.error("Reset Password failed:", error);
      toast.error(
        error?.data?.message || "Reset Password failed. Please try again."
      );
    }
  };

  // Effect to handle countdown and redirect
  useEffect(() => {
    if (redirectCountdown === null) return;

    if (redirectCountdown === 0) {
      router.push("/auth/login");
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Reset your password to regain access to your account
        </p>

        {redirectCountdown !== null ? (
          <div className="text-center">
            <p className="text-green-600 font-medium">
              ✅ Password reset successful!
            </p>
            <p className="mt-2 text-gray-700">
              Redirecting you to login in{" "}
              <span className="font-bold">{redirectCountdown}</span> seconds...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="password"
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2.5 border border-gray-400 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showNewPassword ? (
                <FiEyeOff
                  className="absolute end-2.5 bottom-[0.95rem] text-gray-600 text-lg cursor-pointer"
                  onClick={() => setShowNewPassword(false)}
                />
              ) : (
                <FiEye
                  className="absolute end-2.5 bottom-[0.95rem] text-gray-600 text-lg cursor-pointer"
                  onClick={() => setShowNewPassword(true)}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition disabled:opacity-50"
            >
              {isLoading ? <Loader /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
