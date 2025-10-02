"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/loader";
import { SuccessVerify } from "../../../../../public";
import { useVerifyEmailQuery } from "@/services/auth-service";
import { useEffect, useState } from "react";

const VerifiedEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const { data, isLoading, isSuccess } = useVerifyEmailQuery(token ?? "", {
    skip: !token,
  });

  const [countdown, setCountdown] = useState(5);

  // start countdown only on success
  useEffect(() => {
    if (isSuccess && data) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isSuccess, data]);

  // redirect when countdown finishes
  useEffect(() => {
    if (countdown === 0) {
      router.push("/auth/login");
    }
  }, [countdown, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 text-center">
        {isSuccess && data ? (
          <>
            <Image
              className="w-28 mx-auto"
              src={SuccessVerify}
              alt="Verify Email"
            />
            <h2 className="text-2xl font-bold mb-1">Email Verified</h2>
            <p className="text-sm text-gray-500 mb-6">
              Verification successful. You can now log in.
            </p>
            <p className="text-sm text-gray-700 mb-6">
              Redirecting you to login in{" "}
              <span className="font-semibold">{countdown}</span> seconds…
            </p>
            <Link
              href="/auth/login"
              className="w-full block bg-gray-800 text-white text-center text-sm py-2 px-4 rounded hover:bg-gray-900 transition"
            >
              Go to Login Now
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1 text-red-600">
              Verification Failed
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              The verification link is invalid or has expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifiedEmail;
