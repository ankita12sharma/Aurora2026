import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sleepSlice = createApi({
  reducerPath: "sleep",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.29.35:8084",
  }),

  tagTypes: ["Sleep"],

  endpoints: (builder) => ({
    addSleep: builder.mutation({
      query: (data) => ({
        url: "/add-sleep",
        method: "POST",
        body: data,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: "Sleep", id: arg.userId },
        { type: "Sleep", id: "LIST" },
      ],
    }),

    getSleepByUser: builder.query({
      query: (userId) => `/get-sleep/${userId}`,

      providesTags: (result, error, userId) => [
        { type: "Sleep", id: userId },
        { type: "Sleep", id: "LIST" },
      ],

      keepUnusedDataFor: 60,

      transformResponse: (response) => {
        return response?.data ?? response;
      },
    }),
  }),
});

export const { useAddSleepMutation, useGetSleepByUserQuery } = sleepSlice;
