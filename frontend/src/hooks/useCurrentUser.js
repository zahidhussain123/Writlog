import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../utils/user.databank";

/**
 * The signed-in reader's Writlog profile, on top of their Clerk session.
 *
 * Clerk knows who is signed in but not their `username` handle, which is
 * generated server-side and is what author links and `?author=` filters use.
 */
export const useCurrentUser = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  const { data, isPending, ...rest } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetchCurrentUser(getToken),
    enabled: !!isSignedIn,
    // The handle never changes once it's assigned, so don't refetch it per page.
    staleTime: Infinity,
    retry: 1,
  });

  return {
    ...rest,
    user: data ?? null,
    /** The handle to filter by, or "" until it's known. */
    handle: data?.username ?? "",
    postCount: data?.postCount ?? 0,
    isSignedIn: !!isSignedIn,
    isLoading: !isLoaded || (!!isSignedIn && isPending),
  };
};
