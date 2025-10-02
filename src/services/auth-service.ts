import { baseQueryWithReauth } from "@/core/auth-interceptor";
import {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
} from "@/models/request/auth-request";
import { LoginResponse } from "@/models/response/auth-response";
import { BaseResponse } from "@/models/response/base-response";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    login: build.mutation<BaseResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: build.mutation<any, SignUpRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: build.mutation<any, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyEmail: build.query<any, string>({
      query: (token) => ({
        url: `/auth/verify-email?token=${token}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    resetPassword: build.mutation<any, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useVerifyEmailQuery,
  useResetPasswordMutation
} = authService;
