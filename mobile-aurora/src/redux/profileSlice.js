import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileSlice = createApi({
  reducerPath: "profile",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.29.35:8084",
  }),

  tagTypes: ["Profile"],

  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    createProfile: builder.mutation({
      query: (data) => ({
        url: "/create-profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    getProfile: builder.query({
      query: (userId) => {
        if (!userId) {
          throw new Error("userId is required for getProfile");
        }
        return `/get-profile/${userId}`;
      },
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: ({ userId, ...data }) => {
        if (!userId) {
          throw new Error("userId is required for updateProfile");
        }

        return {
          url: `/update-profile/${userId}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useCreateProfileMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = profileSlice;
