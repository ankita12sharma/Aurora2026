import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userSlice = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.29.35:8084",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (newdata) => ({
        url: "/signup",
        method: "POST",
        body: newdata,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    onboarding: builder.mutation({
      query: (data) => ({
        url: "/onboarding",
        method: "POST",
        body: data,
      }),
    }),

    getProfile: builder.query({
      query: (userId) => ({
        url: `/profile/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useOnboardingMutation,
  useGetProfileQuery,
} = userSlice;
