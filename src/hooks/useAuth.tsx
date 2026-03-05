'use client';

import { useConvexAuth, useQuery } from 'convex/react';
import { useClerk, useUser } from '@clerk/nextjs';
import { api } from '../../convex/_generated/api';

export function useAuth() {
  const { isAuthenticated: convexAuth, isLoading: convexLoading } = useConvexAuth();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(api.users.current, convexAuth ? {} : "skip");

  const isAuthenticated = clerkLoaded && !!clerkUser;

  return {
    // Convex user doc (may be null if Convex auth isn't synced yet)
    user: convexUser ?? null,
    // Clerk user (always available after sign-in)
    clerkUser: clerkUser ?? null,
    // True while auth state is being determined
    loading: !clerkLoaded || convexLoading,
    isAuthenticated,
    signOut: () => signOut(),
  };
}
