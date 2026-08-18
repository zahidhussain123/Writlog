import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill-new";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Film,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Save,
  Send,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  createNewPost,
  fetchSinglePost,
  updatePost,
} from "../utils/post.databank";
import Upload from "../components/upload";
import Image from "../components/Image";
import { usePostPermissions } from "../hooks/usePostPermissions";
import { routePaths } from "../constants/pathRoute";
import "react-quill-new/dist/quill.snow.css";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "web-design", label: "Web Design" },
  { value: "development", label: "Development" },
  { value: "databases", label: "Databases" },
  { value: "seo", label: "Search Engines" },
  { value: "marketing", label: "Marketing" },
];

const CenteredCard = ({ Icon, title, body, action }) => (
  <div className="card mx-auto mt-20 flex max-w-lg flex-col items-center px-8 py-16 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-600/10">
      <Icon size={24} />
    </span>
    <h1 className="mt-5 font-display text-2xl font-bold text-ink-950">{title}</h1>
    <p className="mt-2 text-sm text-ink-500">{body}</p>
    {action}
  </div>
);

const Write = () => {
  const { slug } = useParams();
  const isEditing = !!slug;

  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [cover, setCover] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("general");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isPending: loadingPost, error: loadError } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchSinglePost(slug),
    enabled: isEditing,
    retry: false,
  });

  const { canEdit } = usePostPermissions(post);

  // Prefill once the post arrives. Keyed on _id so a different post reloads the
  // form, while later keystrokes aren't overwritten by a background refetch.
  useEffect(() => {
    if (!post?._id) return;
    setTitle(post.title || "");
    setDesc(post.desc || "");
    setCategory(post.category || "general");
    setValue(post.content || "");
    setCover(post.img ? { filePath: post.img } : "");
  }, [post?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (img?.url) setValue((prev) => `${prev}<p><image src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    if (video?.url) {
      setValue(
        (prev) => `${prev}<p><iframe class="ql-video" src="${video.url}"/></p>`
      );
    }
  }, [video]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEditing
        ? updatePost(post._id, payload, getToken)
        : createNewPost(payload, getToken),
    onSuccess: (res) => {
      toast.success(isEditing ? "Changes saved" : "Post has been created");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredPosts"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["post", res.slug] });
      }
      navigate(`/${res.slug}`);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          (isEditing ? "Could not save your changes" : "Could not create the post")
      );
    },
  });

  const uploading = 0 < progress && progress < 100;

  if (!isLoaded || (isEditing && loadingPost)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-ink-500">
        <Loader2 size={18} className="animate-spin" />
        Loading…
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <CenteredCard
        Icon={LockKeyhole}
        title="Sign in to write"
        body="You need an account before you can publish a story on Writlog."
        action={
          <Link to={routePaths.LOGIN} className="btn-primary mt-7">
            Sign in
          </Link>
        }
      />
    );
  }

  if (isEditing && loadError) {
    return (
      <CenteredCard
        Icon={ShieldAlert}
        title={
          loadError?.response?.status === 404
            ? "Post not found"
            : "Couldn't load that post"
        }
        body={loadError?.response?.data?.message || loadError.message}
        action={
          <Link to={routePaths.POSTS} className="btn-primary mt-7">
            Back to all posts
          </Link>
        }
      />
    );
  }

  if (isEditing && !canEdit) {
    return (
      <CenteredCard
        Icon={ShieldAlert}
        title="You can't edit this post"
        body="Only the author of a post, or an admin, can make changes to it."
        action={
          <Link to={`/${slug}`} className="btn-primary mt-7">
            Back to the post
          </Link>
        }
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) return toast.warn("Give your post a title");
    if (!value?.replace(/<[^>]*>/g, "").trim()) {
      return toast.warn("Write some content first");
    }

    mutation.mutate({
      title: cleanTitle,
      desc,
      category,
      content: value,
      img: cover?.filePath || "",
    });
  };

  const coverSrc = cover?.url || cover?.filePath || "";

  return (
    <div className="pb-8 pt-6 md:pt-10">
      <form onSubmit={handleSubmit}>
        {/* STICKY ACTION BAR */}
        <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-ink-900/[0.07] bg-paper/85 px-4 py-4 backdrop-blur-xl md:top-20 md:-mx-8 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">{isEditing ? "Editing" : "New story"}</p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-950">
                {isEditing ? "Edit post" : "Create a post"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {uploading && (
                <span className="flex items-center gap-2 text-xs font-medium text-ink-500">
                  <Loader2 size={14} className="animate-spin" />
                  Uploading {progress}%
                </span>
              )}
              {isEditing && (
                <Link to={`/${slug}`} className="btn-ghost px-4 py-2.5">
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                disabled={mutation.isPending || uploading}
                className="btn-primary px-6 py-2.5"
              >
                {mutation.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : isEditing ? (
                  <Save size={15} />
                ) : (
                  <Send size={15} />
                )}
                {mutation.isPending
                  ? isEditing
                    ? "Saving…"
                    : "Publishing…"
                  : isEditing
                  ? "Save changes"
                  : "Publish"}
              </button>
            </div>
          </div>

          {uploading && (
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-ink-900/[0.07]">
              <div
                className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
          {/* MAIN COLUMN */}
          <div className="flex min-w-0 flex-col gap-6">
            {/* COVER */}
            {coverSrc ? (
              <div className="relative overflow-hidden rounded-3xl shadow-card">
                <Image
                  src={coverSrc}
                  alt="Cover preview"
                  className="aspect-[21/9] w-full object-cover"
                  w="1400"
                />
                <button
                  type="button"
                  onClick={() => setCover("")}
                  aria-label="Remove cover image"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-scrim/60 text-ondark-bg backdrop-blur transition hover:bg-scrim"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <Upload type="image" setProgress={setProgress} setData={setCover}>
                <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink-900/[0.12] bg-surface/50 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-surface">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <ImagePlus size={20} />
                  </span>
                  <p className="text-sm font-semibold text-ink-800">
                    Add a cover image
                  </p>
                  <p className="text-xs text-ink-400">
                    Wide images look best. Use 1600×700 or larger.
                  </p>
                </div>
              </Upload>
            )}

            {/* TITLE */}
            <input
              className="w-full bg-transparent font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-950 outline-none placeholder:text-ink-300 md:text-5xl"
              type="text"
              placeholder="My awesome story"
              name="title"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* DESCRIPTION */}
            <textarea
              className="field resize-y text-[0.95rem]"
              name="desc"
              rows={2}
              placeholder="A short description. This is the teaser readers see in the list."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            {/* EDITOR */}
            <div className="overflow-hidden rounded-3xl border border-ink-900/[0.07] bg-surface shadow-soft">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                readOnly={uploading}
                placeholder="Tell your story…"
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="flex h-max flex-col gap-5 lg:sticky lg:top-44">
            <div className="card p-5">
              <h2 className="eyebrow mb-3">Category</h2>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={category === option.value}
                    onClick={() => setCategory(option.value)}
                    className={
                      category === option.value ? "chip-active" : "chip-idle"
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h2 className="eyebrow mb-3">Insert media</h2>
              <div className="flex flex-col gap-2">
                <Upload type="image" setProgress={setProgress} setData={setImg}>
                  <span className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-600 transition hover:bg-ink-900/[0.04] hover:text-ink-900">
                    <ImagePlus size={15} className="text-ink-400" />
                    Add an image
                  </span>
                </Upload>
                <Upload type="video" setProgress={setProgress} setData={setVideo}>
                  <span className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-600 transition hover:bg-ink-900/[0.04] hover:text-ink-900">
                    <Film size={15} className="text-ink-400" />
                    Add a video
                  </span>
                </Upload>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-400">
                Media is appended to the end of your post. Drag it into place
                from the editor.
              </p>
            </div>

            {isEditing && (
              <p className="rounded-2xl bg-ink-900/[0.04] px-4 py-3 text-xs leading-relaxed text-ink-500">
                The post URL stays <span className="font-medium">/{slug}</span>{" "}
                even if you change the title, so existing links keep working.
              </p>
            )}

            {mutation.isError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-600/10">
                {mutation.error?.response?.data?.message ||
                  mutation.error.message}
              </p>
            )}
          </aside>
        </div>
      </form>
    </div>
  );
};

export default Write;
