import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiSlice = createApi({
  reducerPath: "aiSlice",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.29.35:8084",
  }),

  tagTypes: ["AI"],

  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/ai-agent",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = aiSlice;
