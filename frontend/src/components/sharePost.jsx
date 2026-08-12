import { useState } from "react";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { toast } from "react-toastify";

const SharePost = ({ title = "", className = "" }) => {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const targets = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Twitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link to this post"
        className="btn-icon"
      >
        {copied ? (
          <Check size={15} className="text-brand-600" />
        ) : (
          <Link2 size={15} />
        )}
      </button>

      {targets.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="btn-icon"
        >
          <Icon size={15} />
        </a>
      ))}
    </div>
  );
};

export default SharePost;
