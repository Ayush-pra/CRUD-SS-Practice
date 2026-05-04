import { useState } from "react";

const CreatePost = ({ onSubmit, isSubmitting }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }
    await onSubmit(trimmed);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        New post
      </label>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        placeholder="Share something short and clear..."
        className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
      />
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
