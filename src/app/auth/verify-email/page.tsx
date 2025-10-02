"use client";

import { Suspense } from "react";
import VerifiedEmail from "./components/verifiedEmail";
import Loader from "@/components/loader";

const VerifyEmail = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <VerifiedEmail />
    </Suspense>
  );
};

export default VerifyEmail;
