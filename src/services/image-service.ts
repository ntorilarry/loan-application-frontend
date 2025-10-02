import { baseQueryWithReauth } from "@/core/auth-interceptor";
import { BaseResponse } from "@/models/response/base-response";
import { createApi } from "@reduxjs/toolkit/query/react";

export const imageService = createApi({
  reducerPath: "imageService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ImageUpload"],
  endpoints: (build) => ({
    uploadImage: build.mutation<BaseResponse<any>, FormData>({
      query: (formData) => ({
        url: "/images/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ImageUpload"],
    }),
  }),
});

export const { useUploadImageMutation } = imageService;
