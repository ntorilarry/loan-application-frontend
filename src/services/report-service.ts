import { baseQueryWithReauth } from "@/core/auth-interceptor";
import { BaseResponse } from "@/models/response/base-response";
import { ListReportDashboardResponse } from "@/models/response/report-response";
import { createApi } from "@reduxjs/toolkit/query/react";

export const reportService = createApi({
  reducerPath: "reportService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Report"],
  endpoints: (build) => ({
    listDashboardReports: build.query<
      BaseResponse<ListReportDashboardResponse>,
      void
    >({
      query: () => ({
        url: "/reports/dashboard",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),
  }),
});

export const {
useListDashboardReportsQuery
} = reportService;
