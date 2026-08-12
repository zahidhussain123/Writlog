import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Film,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Send,
  X,
} from "lucide-react";
import { createNewPost } from "../utils/post.databank";
import Upload from "../components/upload";
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

const Write = () => {
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [cover, setCover] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("general");
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

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
    mutationFn: (newPost) => createNewPost(newPost, getToken),
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/${res.slug}`);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not create the post");
    },
  });

  const uploading = 0 < progress && progress < 100;

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-ink-500">
        <Loader2 size={18} className="animate-spin" />
        Loading…
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="card mx-auto mt-20 flex max-w-lg flex-col items-center px-8 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-600/10">
          <LockKeyhole size={24} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink-950">
          Sign in to write
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          You need an account before you can publish a story on Writlog.
        </p>
        <Link to={routePaths.LOGIN} className="btn-primary mt-7">
          Sign in
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const title = formData.get("title")?.trim();
    if (!title) return toast.warn("Give your post a title");
    if (!value?.replace(/<[^>]*>/g, "").trim()) {
      return toast.warn("Write some content first");
    }

    mutation.mutate({
      title,
      desc: formData.get("desc"),
      category: formData.get("category"),
      content: value,
      img: cover?.filePath || "",
    });
  };

  return (
    <div className="pb-8 pt-6 md:pt-10">
      <form onSubmit={handleSubmit}>
        {/* STICKY ACTION BAR */}
        <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-ink-900/[0.07] bg-paper/85 px-4 py-4 backdrop-blur-xl md:top-20 md:-mx-8 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">New story</p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-950">
                Create a post
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {uploading && (
                <span className="flex items-center gap-2 text-xs font-medium text-ink-500">
                  <Loader2 size={14} className="animate-spin" />
                  Uploading {progress}%
                </span>
              )}
              <button
                type="submit"
                disabled={mutation.isPending || uploading}
                className="btn-primary px-6 py-2.5"
              >
                {mutation.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {mutation.isPending ? "Publishing…" : "Publish"}
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
            {cover?.url ? (
              <div className="relative overflow-hidden rounded-3xl shadow-card">
                <img
                  src={cover.url}
                  alt="Cover preview"
                  className="aspect-[21/9] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCover("")}
                  aria-label="Remove cover image"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/60 text-white backdrop-blur transition hover:bg-ink-950"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <Upload type="image" setProgress={setProgress} setData={setCover}>
                <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink-900/[0.12] bg-white/50 px-6 py-12 text-center transition hover:border-brand-400 hover:bg-white">
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
              className="w-full bg-transparent font-display text-3xl font-black leading-tight tracking-tight text-ink-950 outline-none placeholder:text-ink-300 md:text-5xl"
              type="text"
              placeholder="My awesome story"
              name="title"
              autoComplete="off"
            />

            {/* DESCRIPTION */}
            <textarea
              className="field resize-y text-[0.95rem]"
              name="desc"
              rows={2}
              placeholder="A short description. This is the teaser readers see in the list."
            />

            {/* EDITOR */}
            <div className="overflow-hidden rounded-3xl border border-ink-900/[0.07] bg-white shadow-soft">
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
              <input type="hidden" name="category" value={category} />
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={category === option.value}
                    onClick={() => setCategory(option.value)}
                    className={`rounded-full px-3 py-1.5 text-[0.8rem] font-medium transition duration-200 ${
                      category === option.value
                        ? "bg-ink-950 text-white shadow-soft"
                        : "bg-ink-900/[0.045] text-ink-600 hover:bg-ink-900/[0.08] hover:text-ink-900"
                    }`}
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
