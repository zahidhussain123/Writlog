import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, MessageCircle, Send } from "lucide-react";
import Comment from "./Comment";
import { fetchComments } from "../utils/comment.databank";
import { routePaths } from "../constants/pathRoute";

const Comments = ({ postId }) => {
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();

  const { status, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/comments/${postId}`,
        newComment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not post your comment");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc")?.trim();

    if (!desc) {
      toast.warn("Write something first");
      return;
    }
    if (!isSignedIn) {
      toast.warn("Please sign in to comment");
      return;
    }

    mutation.mutate({ desc });
    e.target.reset();
  };

  const comments = Array.isArray(data) ? data : [];

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center gap-3">
        <MessageCircle size={20} className="text-brand-600" />
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950">
          Discussion
        </h2>
        {comments.length > 0 && (
          <span className="rounded-full bg-ink-900/[0.06] px-2.5 py-1 text-xs font-semibold text-ink-600">
            {comments.length}
          </span>
        )}
      </div>

      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="card p-4">
          <div className="flex gap-3">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt=""
                className="mt-1 h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-surface"
              />
            )}
            <textarea
              name="desc"
              rows={3}
              placeholder="Write a comment"
              className="w-full resize-y bg-transparent py-1.5 text-[0.95rem] leading-relaxed text-ink-800 outline-none placeholder:text-ink-400"
            />
          </div>
          <div className="mt-3 flex items-center justify-end border-t border-ink-900/[0.06] pt-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-brand px-5 py-2 text-[0.85rem]"
            >
              {mutation.isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {mutation.isPending ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="card flex flex-col items-center gap-3 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-ink-600">
            Sign in to join the discussion on this post.
          </p>
          <Link to={routePaths.LOGIN} className="btn-primary shrink-0">
            Sign in to comment
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {status === "pending" ? (
          <p className="flex items-center gap-2 py-4 text-sm text-ink-500">
            <Loader2 size={15} className="animate-spin" />
            Loading comments…
          </p>
        ) : status === "error" ? (
          <p className="py-4 text-sm text-red-600">
            {error?.response?.data?.message || "Error loading comments!"}
          </p>
        ) : (
          <>
            {mutation.isPending && (
              <Comment
                pending
                comment={{
                  desc: mutation.variables.desc,
                  createdAt: new Date(),
                  user: {
                    img: user?.imageUrl,
                    // Clerk's `username` is often null; `fullName` is what the
                    // server will end up storing as displayName.
                    displayName: user?.fullName,
                    username: user?.username,
                  },
                }}
              />
            )}

            {comments.length === 0 && !mutation.isPending && (
              <p className="py-6 text-center text-sm text-ink-400">
                No comments yet. Be the first to share your thoughts.
              </p>
            )}

            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} postId={postId} />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Comments;
