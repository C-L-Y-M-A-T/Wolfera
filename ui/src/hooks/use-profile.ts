"use client";

import { useQuery, useApolloClient } from "@apollo/client";
import { GET_ME, GET_USER_PROFILE, GET_ALL_USERS } from "@/lib/graphql/queries";
import type { UserDto } from "@/lib/graphql/types";
import { useMemo } from "react";
import { ProfileService } from "@/services/api/graphql/profile.service";

/**
 * Hook to get current user's profile
 */
export function useMyProfile() {
  const { data, loading, error, refetch } = useQuery(GET_ME, {
    errorPolicy: "all",
  });

  const profileStats = useMemo(() => {
    if (!data?.me) return null;
    return ProfileService.transformToProfileStats(data.me);
  }, [data?.me]);

  const achievements = useMemo(() => {
    if (!data?.me) return [];
    return ProfileService.transformBadgesToAchievements(data.me.badges);
  }, [data?.me]);

  const recentGames = useMemo(() => {
    if (!data?.me) return [];
    return ProfileService.generateMockRecentGames(data.me);
  }, [data?.me]);

  return {
    user: data?.me as UserDto | undefined,
    profileStats,
    achievements,
    recentGames,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get a specific user's profile
 */
export function useUserProfile(username: string) {
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { username },
    skip: !username,
    errorPolicy: "all",
  });

  const profileStats = useMemo(() => {
    if (!data?.userProfile) return null;
    return ProfileService.transformToProfileStats(data.userProfile);
  }, [data?.userProfile]);

  const achievements = useMemo(() => {
    if (!data?.userProfile) return [];
    return ProfileService.transformBadgesToAchievements(
      data.userProfile.badges,
    );
  }, [data?.userProfile]);

  const recentGames = useMemo(() => {
    if (!data?.userProfile) return [];
    return ProfileService.generateMockRecentGames(data.userProfile);
  }, [data?.userProfile]);

  return {
    user: data?.userProfile as UserDto | undefined,
    profileStats,
    achievements,
    recentGames,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get all users (for friend suggestions)
 */
export function useAllUsers() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    errorPolicy: "all",
  });

  return {
    users: data?.allUsers as UserDto[] | undefined,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for profile actions
 */
export function useProfileActions() {
  const client = useApolloClient();

  const refreshProfile = async () => {
    try {
      await client.refetchQueries({
        include: [GET_ME],
      });
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const clearCache = () => {
    client.cache.reset();
  };

  return {
    refreshProfile,
    clearCache,
  };
}
