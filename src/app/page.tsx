"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./dashboard/page";
import { useAuth } from "@/utils/authContext";
import Loader from "@/components/loader";

const Home = () => {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/auth/login");
    }
  }, [loading, token, router]);

  if (loading) {
    return <Loader />;
  }

  if (!token) {
    return null;
  }

  return <Dashboard />;
};

export default Home;
