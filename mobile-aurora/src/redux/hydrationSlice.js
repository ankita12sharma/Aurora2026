import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hydrationSlice = createApi({
  reducerPath: "hydration",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.29.35:8084",
  }),

  tagTypes: ["Water"],

  endpoints: (builder) => ({
    addWater: builder.mutation({
      query: (data) => ({
        url: "/add-water",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Water"],
    }),

    getHydration: builder.query({
      query: (userId) => ({
        url: `/get/${userId}`,
        method: "GET",
      }),

      providesTags: ["Water"],
    }),
  }),
});

export const { useAddWaterMutation, useGetHydrationQuery } = hydrationSlice;
