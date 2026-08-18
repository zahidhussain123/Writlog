import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { usePostPermissions } from "../hooks/usePostPermissions";
import { editPath } from "../constants/pathRoute";

/** Author/admin shortcut into the editor, prefilled with this post. */
const EditPostLink = ({ post, className = "" }) => {
  const { canEdit } = usePostPermissions(post);

  if (!canEdit) return null;

  return (
    <Link
      to={editPath(post.slug)}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 bg-surface/70 px-3.5 py-2 text-xs font-semibold text-ink-500 transition hover:border-brand-500/25 hover:bg-brand-50 hover:text-brand-700 ${className}`}
    >
      <Pencil size={14} />
      Edit post
    </Link>
  );
};

export default EditPostLink;
