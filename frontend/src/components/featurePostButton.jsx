import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader2, Star } from "lucide-react";
import { updatePost } from "../utils/post.databank";
import { usePostPermissions } from "../hooks/usePostPermissions";

/**
 * Admin-only toggle for `isFeatured`, which decides what shows in the homepage
 * Featured section. The server rejects non-admins regardless of this check.
 */
const FeaturePostButton = ({ post, className = "" }) => {
  const { canFeature } = usePostPermissions(post);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const featured = !!post?.isFeatured;

  const mutation = useMutation({
    mutationFn: () => updatePost(post._id, { isFeatured: !featured }, getToken),
    onSuccess: (updated) => {
      toast.success(
        updated?.isFeatured ? "Post featured" : "Removed from featured"
      );
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
      queryClient.invalidateQueries({ queryKey: ["featuredPosts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not update the post");
    },
  });

  if (!canFeature) return null;

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      aria-pressed={featured}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-60 ${
        featured
          ? "border-accent-500/25 bg-accent-100 text-accent-600 hover:bg-accent-100/70"
          : "border-ink-900/10 bg-surface/70 text-ink-500 hover:border-accent-500/25 hover:bg-accent-100/60 hover:text-accent-600"
      } ${className}`}
    >
      {mutation.isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Star size={14} className={featured ? "fill-current" : ""} />
      )}
      {featured ? "Featured" : "Feature this post"}
    </button>
  );
};

export default FeaturePostButton;
