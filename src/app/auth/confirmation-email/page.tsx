"use client";

import Image from "next/image";
// import Link from "next/link";
import React from "react";
import { EmailSuccess } from "../../../../public";

const ConfirmationEmail = () => {
  return (
    <div>
      {" "}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <Image className="w-36 " src={EmailSuccess} alt="Verify Email" />

          <h2 className="text-2xl font-bold mb-1">Verify Email</h2>
          <p className="text-sm text-gray-500 mb-6">
            Signup successful. Please check your email to verify your account.
          </p>

          {/* <Link
            href="/auth/login"
            className="w-full block bg-gray-800 text-white text-center text-sm py-2 px-4 rounded hover:bg-gray-900 transition disabled:opacity-50"
          >
            Go to Login
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationEmail;
