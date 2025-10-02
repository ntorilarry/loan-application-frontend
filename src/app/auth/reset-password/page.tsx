"use client";

import { Suspense } from "react";
import Loader from "@/components/loader";
import PasswordReset from "./components/passwordReset";

const ResetPassword = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <PasswordReset />
    </Suspense>
  );
};

export default ResetPassword;
