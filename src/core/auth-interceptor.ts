import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { AppConstants } from "../core/app-constants";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: AppConstants.baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // if 401 unauthorized, try refresh
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (refresh_token) {
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh-token", // ✅ matches backend
              method: "POST",
              body: { refresh_token }, // ✅ matches backend payload
              headers: {
                "Content-Type": "application/json",
              },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const data = (refreshResult.data as any).data; // backend wraps data

            // Save new tokens
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem(
              "refresh_token_expires",
              data.refresh_token_expires
            );
            localStorage.setItem("user", JSON.stringify(data.user));

            // Retry the original request
            result = await baseQuery(args, api, extraOptions);
          } else {
            throw new Error("Refresh token failed");
          }
        } else {
          throw new Error("No refresh token available");
        }
      } catch (error) {
        console.error("Refresh token error:", error);
        localStorage.clear();
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
