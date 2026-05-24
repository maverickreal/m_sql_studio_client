import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Assignment,
  AssignmentDetail,
  SqlExecutionRequest,
  JobStatus,
  CreateAssignmentPayload,
} from "../types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Assignments", "Assignment"],
  endpoints: (builder) => ({
    getAssignments: builder.query<
      { assignments: Assignment[] },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/assignments?page=${page}&limit=${limit}`,
      providesTags: ["Assignments"],
    }),

    getAssignmentById: builder.query<
      { assignment: AssignmentDetail },
      string
    >({
      query: (id) => `/assignments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Assignment", id }],
    }),

    executeSql: builder.mutation<
      { taskId: string },
      SqlExecutionRequest
    >({
      query: (body) => ({
        url: "/assignments/client-sql-code-run/execute",
        method: "POST",
        body,
      }),
    }),

    getJobStatus: builder.query<JobStatus, string>({
      query: (taskId) => `/assignments/client-sql-code-run/status/${taskId}`,
      keepUnusedDataFor: 0,
    }),

    createAssignment: builder.mutation<
      { assignmentId: string; jobId: string },
      CreateAssignmentPayload
    >({
      query: (body) => ({
        url: "/admin/assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assignments"],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useExecuteSqlMutation,
  useGetJobStatusQuery,
  useCreateAssignmentMutation,
} = api;
