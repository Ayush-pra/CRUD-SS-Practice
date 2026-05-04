import { useState } from "react";

const PostCard = ({ post, canEdit, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);

  const handleSave = async () => {
    const next = draft.trim();
    if (!next) {
      return;
    }
    await onUpdate(post.id, next);
    setIsEditing(false);
  };

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Post</p>
          <p className="mt-2 text-sm text-slate-500">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
        {canEdit ? (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:text-slate-900"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="rounded-full border border-rose-100 px-3 py-1 text-rose-500 transition hover:text-rose-600"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-base text-slate-800">{post.content}</p>
      )}
    </article>
  );
};

export default PostCard;
