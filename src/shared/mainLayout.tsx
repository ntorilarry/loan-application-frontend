"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import ProtectedRoute from "@/utils/protectedRoutes";
import { useState } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="dark:bg-neutral-800 h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:pl-[250px]">
          <div className="sticky top-0 z-20">
            <Header setSidebarOpen={setSidebarOpen} />
          </div>
          <main className="py-10 dark:bg-neutral-800 bg-white">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MainLayout;
