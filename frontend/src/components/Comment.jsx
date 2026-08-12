import { format } from "timeago.js";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Image from "./Image";
import { authorInitials, authorName } from "../utils/author";

const Comment = ({ comment, postId, pending = false }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_BASE_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete the comment");
    },
  });

  const username = authorName(comment?.user);
  // Match on clerkId, not username. The stored `username` is a display name
  // built from first/last name, which never equals Clerk's `user.username`.
  const isOwner = !!comment?.user?.clerkId && comment.user.clerkId === user?.id;
  const canDelete = !pending && !!user && (isOwner || role === "admin");

  return (
    <article
      className={`group card p-5 transition ${
        pending ? "opacity-60" : "hover:border-ink-900/[0.09]"
      }`}
    >
      <div className="flex items-center gap-3">
        {comment?.user?.img ? (
          <Image
            src={comment.user.img}
            alt={username}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
            w="36"
            h="36"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-[0.7rem] font-bold text-brand-700 ring-2 ring-white">
            {authorInitials(comment?.user)}
          </span>
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900">{username}</p>
          <p className="text-xs text-ink-400">
            {pending ? "Posting…" : format(comment.createdAt)}
          </p>
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            aria-label="Delete comment"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100 disabled:opacity-50"
          >
            <Trash2 size={13} />
            {mutation.isPending ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>

      <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-relaxed text-ink-700">
        {comment?.desc}
      </p>
    </article>
  );
};

export default Comment;
