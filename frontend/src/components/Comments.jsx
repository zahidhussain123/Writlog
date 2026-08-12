import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Comment from "./Comment";
import { fetchComments } from "../utils/comment.databank";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

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
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>

      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl disabled:bg-blue-400"
        >
          Send
        </button>
      </form>

      {status === "pending" ? (
        <p className="text-sm text-slate-500">Loading comments…</p>
      ) : status === "error" ? (
        <p className="text-sm text-red-500">
          {error?.response?.data?.message || "Error loading comments!"}
        </p>
      ) : (
        <>
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date(),
                user: {
                  img: user?.imageUrl,
                  username: user?.username,
                },
              }}
            />
          )}

          {comments?.length === 0 && !mutation.isPending && (
            <p className="text-sm text-slate-500">
              No comments yet - be the first to share your thoughts.
            </p>
          )}

          {comments?.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
