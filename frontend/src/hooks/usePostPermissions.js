import { useUser } from "@clerk/clerk-react";

/**
 * What the signed-in reader may do with a post. Ownership matches on clerkId,
 * never on `username`, which stores a display name.
 *
 * These decide whether a control is worth showing. Every endpoint re-checks the
 * same rules server-side.
 */
export const usePostPermissions = (post) => {
  const { user, isSignedIn } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isOwner = !!post?.user?.clerkId && post.user.clerkId === user?.id;
  const signedIn = !!isSignedIn;

  return {
    isSignedIn: signedIn,
    isAdmin,
    isOwner,
    canEdit: signedIn && (isOwner || isAdmin),
    canDelete: signedIn && (isOwner || isAdmin),
    // Featuring is editorial, so owning the post doesn't grant it.
    canFeature: signedIn && isAdmin,
  };
};
