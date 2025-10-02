"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Loader from "@/components/loader";
import { useAuth } from "./authContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loader />;
  }

  return <>{children}</>;
}
