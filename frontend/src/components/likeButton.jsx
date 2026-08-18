import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import { toggleLikePost } from "../utils/post.databank";
import { formatCount } from "../utils/readingTime";
import { routePaths } from "../constants/pathRoute";

const SHELL =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-60";


const LikeButton = ({ post, queryKey, className = "" }) => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const likeCount = post?.likeCount ?? 0;
  const isLiked = !!post?.isLiked;

  // Written straight into the cache rather than invalidating: a refetch would
  // go back through the post endpoint and inflate its view counter every time
  // somebody taps the heart.
  const writeLikeState = (next) =>
    queryClient.setQueryData(queryKey, (current) =>
      current ? { ...current, ...next } : current
    );

  const mutation = useMutation({
    mutationFn: () => toggleLikePost(post._id, getToken),
    // The heart should respond on tap, not a round trip later.
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      writeLikeState({
        isLiked: !isLiked,
        likeCount: Math.max(0, likeCount + (isLiked ? -1 : 1)),
      });
      return { previous };
    },
    onError: (err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error(err?.response?.data?.message || "Could not update your like");
    },
    onSuccess: (data) =>
      writeLikeState({ isLiked: data.isLiked, likeCount: data.likeCount }),
  });

  const label = likeCount > 0 ? formatCount(likeCount) : "";

  if (!isSignedIn) {
    return (
      <Link
        to={routePaths.LOGIN}
        title="Sign in to like this post"
        className={`${SHELL} border-ink-900/10 bg-surface/70 text-ink-500 hover:border-rose-500/25 hover:bg-rose-50 hover:text-rose-600 ${className}`}
      >
        <Heart size={14} />
        {label ? `${label} likes` : "Like"}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike this post" : "Like this post"}
      className={`${SHELL} ${
        isLiked
          ? "border-rose-500/25 bg-rose-50 text-rose-600 hover:bg-rose-100/70"
          : "border-ink-900/10 bg-surface/70 text-ink-500 hover:border-rose-500/25 hover:bg-rose-50 hover:text-rose-600"
      } ${className}`}
    >
      <Heart size={14} className={isLiked ? "fill-current" : ""} />
      {label || (isLiked ? "Liked" : "Like")}
    </button>
  );
};

export default LikeButton;
