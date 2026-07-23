import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  projectTeams?: ProjectTeam[];
}

export interface ProjectTeam {
  id: number;
  teamId: number;
  projectId: number;
  team?: Team;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId?: number;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  user?: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  id?: number;
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
  productOwnerUsername?: string;
  projectManagerUsername?: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    getProject: build.query<Project, number>({
      query: (projectId) => `projects/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
        "Projects",
      ],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    assignTeamToProject: build.mutation<
      ProjectTeam,
      { projectId: number; teamId: number }
    >({
      query: ({ projectId, teamId }) => ({
        url: `projects/${projectId}/teams`,
        method: "POST",
        body: { teamId },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        "Projects",
      ],
    }),
    removeTeamFromProject: build.mutation<
      { message: string; id: number },
      { projectId: number; teamId: number }
    >({
      query: ({ projectId, teamId }) => ({
        url: `projects/${projectId}/teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        "Projects",
      ],
    }),
    getTasks: build.query<Task[], { projectId?: number } | void>({
      query: (arg) => {
        if (arg && arg.projectId !== undefined) {
          return `tasks?projectId=${arg.projectId}`;
        }
        return "tasks";
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const, id: "LIST" },
            ]
          : [{ type: "Tasks" as const, id: "LIST" }],
    }),
    getTask: build.query<Task, number>({
      query: (taskId) => `tasks/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: "Tasks", id: taskId }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const, id: userId },
            ]
          : [{ type: "Tasks" as const, id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    updateTask: build.mutation<Task, { taskId: number; data: Partial<Task> }>({
      query: ({ taskId, data }) => ({
        url: `tasks/${taskId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),
    deleteTask: build.mutation<{ message: string; id: number }, number>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
    createComment: build.mutation<
      Comment,
      { text: string; taskId: number; userId: number }
    >({
      query: (body) => ({
        url: "comments",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),
    deleteComment: build.mutation<
      { message: string; id: number },
      { commentId: number; taskId: number }
    >({
      query: ({ commentId }) => ({
        url: `comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),
    createAttachment: build.mutation<
      Attachment,
      {
        fileURL: string;
        fileName?: string;
        taskId: number;
        uploadedById: number;
      }
    >({
      query: (body) => ({
        url: "attachments",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),
    uploadAttachment: build.mutation<
      Attachment,
      { file: File; taskId: number; uploadedById: number }
    >({
      query: ({ file, taskId, uploadedById }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("taskId", String(taskId));
        formData.append("uploadedById", String(uploadedById));
        return {
          url: "attachments/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),
    deleteAttachment: build.mutation<
      { message: string; id: number },
      { attachmentId: number; taskId: number }
    >({
      query: ({ attachmentId }) => ({
        url: `attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useAssignTeamToProjectMutation,
  useRemoveTeamFromProjectMutation,
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useCreateAttachmentMutation,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
} = api;
