import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { deletePost } from "../utils/post.databank";
import { usePostPermissions } from "../hooks/usePostPermissions";
import { routePaths } from "../constants/pathRoute";

/**
 * Owner/admin-only delete for a post. The server re-checks ownership on every
 * request, so this only decides whether the control is worth showing.
 */
const DeletePostButton = ({ post, className = "" }) => {
  const [open, setOpen] = useState(false);
  const { canDelete } = usePostPermissions(post);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cancelRef = useRef(null);

  const mutation = useMutation({
    mutationFn: () => deletePost(post._id, getToken),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredPosts"] });
      queryClient.removeQueries({ queryKey: ["post", post.slug] });
      navigate(routePaths.POSTS, { replace: true });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not delete the post");
      setOpen(false);
    },
  });

  // Escape closes the dialog, and the page behind it shouldn't scroll.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !mutation.isPending) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, mutation.isPending]);

  if (!canDelete) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 bg-surface/70 px-3.5 py-2 text-xs font-semibold text-ink-500 transition hover:border-red-600/20 hover:bg-red-50 hover:text-red-600 ${className}`}
      >
        <Trash2 size={14} />
        Delete post
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-post-title"
          className="fixed inset-0 z-[60] flex animate-fade-in items-center justify-center bg-scrim/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !mutation.isPending) {
              setOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md animate-fade-up rounded-3xl border border-ink-900/[0.06] bg-surface p-6 shadow-lift md:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10">
              <TriangleAlert size={22} />
            </span>

            <h2
              id="delete-post-title"
              className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-950"
            >
              Delete this post?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              <span className="font-medium text-ink-700">“{post.title}”</span>{" "}
              and all of its comments will be permanently removed. This can’t be
              undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
                className="btn-outline"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="btn bg-red-600 text-paper shadow-soft transition hover:bg-red-700 disabled:opacity-60"
              >
                {mutation.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                {mutation.isPending ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePostButton;
