import { baseQueryWithReauth } from "@/core/auth-interceptor";
import {
  ApproveLoanRequest,
  CaptureLoanRequest,
  DisburseLoanRequest,
  LoanParams,
  RegisterLoanRequest,
  RepayLoanRequest,
} from "@/models/request/loan-request";
import { BaseResponse } from "@/models/response/base-response";
import { ListLoanResponse } from "@/models/response/loan-response";
import { createApi } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";

export const loanService = createApi({
  reducerPath: "loanService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Loan"],
  endpoints: (build) => ({
    listLoans: build.query<BaseResponse<ListLoanResponse[]>, LoanParams>({
      query: (params) => ({
        url: `/loans?${queryString.stringify(params)}`,
        method: "GET",
      }),
      providesTags: ["Loan"],
    }),
    getLoan: build.query<any, string>({
      query: (loanId) => ({
        url: `/loans/${loanId}`,
        method: "GET",
      }),
      providesTags: ["Loan"],
    }),
    registerLoan: build.mutation<BaseResponse<any>, RegisterLoanRequest>({
      query: (body) => ({
        url: "/loans/register",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Loan"],
    }),
    editLoanRegistration: build.mutation<
      BaseResponse<any>,
      { loanId: number; body: RegisterLoanRequest }
    >({
      query: ({ loanId, body }) => ({
        url: `/loans/${loanId}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Loan"],
    }),
    captureLoan: build.mutation<
      BaseResponse<any>,
      { loanId: number; body: CaptureLoanRequest }
    >({
      query: ({ loanId, body }) => ({
        url: `/loans/${loanId}/capture`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Loan"],
    }),
    approveLoan: build.mutation<
      BaseResponse<any>,
      { loanId: number; body: ApproveLoanRequest }
    >({
      query: ({ loanId, body }) => ({
        url: `/loans/${loanId}/approve`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Loan"],
    }),
    disburseLoan: build.mutation<
      BaseResponse<any>,
      { loanId: number; body: DisburseLoanRequest }
    >({
      query: ({ loanId, body }) => ({
        url: `/loans/${loanId}/disburse`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Loan"],
    }),
    repayLoan: build.mutation<
      BaseResponse<any>,
      { loanId: number; body: RepayLoanRequest }
    >({
      query: ({ loanId, body }) => ({
        url: `/loans/${loanId}/repayments`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loan"],
    }),
  }),
});

export const {
  useListLoansQuery,
  useGetLoanQuery,
  useRegisterLoanMutation,
  useEditLoanRegistrationMutation,
  useCaptureLoanMutation,
  useApproveLoanMutation,
  useDisburseLoanMutation,
  useRepayLoanMutation,
} = loanService;
