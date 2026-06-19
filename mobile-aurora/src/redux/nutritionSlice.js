import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const nutritionSlice = createApi({
  reducerPath: "nutrition",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.29.35:8084",
  }),

  tagTypes: ["Nutrition"],

  endpoints: (builder) => ({
    addNutrition: builder.mutation({
      query: (data) => ({
        url: "/add-nutrition",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Nutrition"],
    }),

    getNutritionByUser: builder.query({
      query: (userId) => `/get-nutrition/${userId}`,
      providesTags: ["Nutrition"],
    }),

    getTodayNutrition: builder.query({
      query: (userId) => `/get-today-nutrition/${userId}`,
      providesTags: ["Nutrition"],
    }),

    deleteNutrition: builder.mutation({
      query: (nutritionId) => ({
        url: `/delete-nutrition/${nutritionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Nutrition"],
    }),
  }),
});

export const {
  useAddNutritionMutation,
  useGetNutritionByUserQuery,
  useGetTodayNutritionQuery,
  useDeleteNutritionMutation,
} = nutritionSlice;
