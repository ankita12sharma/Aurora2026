import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const habitSlice = createApi({
  reducerPath: "habit",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.29.35:8084",
  }),

  tagTypes: ["Habit"],

  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    addHabit: builder.mutation({
      query: (data) => ({
        url: "/add-habit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Habit"],
    }),

    getHabitsByUser: builder.query({
      query: (userId) => {
        if (!userId) {
          throw new Error("userId is required");
        }
        return `/get-habits/${userId}`;
      },
      providesTags: ["Habit"],
      refetchOnMountOrArgChange: true,
    }),

    toggleHabit: builder.mutation({
      query: (habitId) => ({
        url: `/toggle-habit/${habitId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Habit"],
    }),

    deleteHabit: builder.mutation({
      query: (habitId) => ({
        url: `/delete-habit/${habitId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Habit"],
    }),
  }),
});

export const {
  useAddHabitMutation,
  useGetHabitsByUserQuery,
  useToggleHabitMutation,
  useDeleteHabitMutation,
} = habitSlice;
