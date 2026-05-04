import { baseApi } from '@/api/base.api';

export interface AdminStats {
  stats: {
    totalUsers: number;
    totalQuestions: number;
    totalInterviews: number;
    activeNow: number;
  };
  userGrowth: { date: string; count: number }[];
  interviewActivity: { date: string; count: number }[];
  categoryDistribution: { name: string; count: number }[];
}

export interface UserStats {
  stats: {
    totalAttempts: number;
    totalCompleted: number;
    averageScore: number;
    streak: number;
  };
  scoreProgression: { date: string; score: number; title: string }[];
  skillDistribution: { subject: string; A: number; fullMark: number }[];
  recentActivity: { date: string; count: number }[];
}

/**
 * Dashboard statistics endpoints.
 */
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/dashboard/admin',
      transformResponse: (response: { data: AdminStats }) => response.data,
      providesTags: ['User', 'Interview', 'Question'],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => '/dashboard/user',
      transformResponse: (response: { data: UserStats }) => response.data,
      providesTags: ['Interview'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetUserStatsQuery,
} = dashboardApi;
