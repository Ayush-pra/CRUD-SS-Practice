import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import Spinner from "../components/Spinner.jsx";

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const loadFeed = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("[feed] request: GET /users/profile");
      const response = await api.get("/users/profile");
      console.log("[feed] response:", response.data);
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error("[feed] error:", err?.response?.data || err);
      if (err?.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError("Could not load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleCreatePost = async (content) => {
    setPosting(true);
    setStatusMessage("");
    setStatusError("");
    try {
      console.log("[posts] request: POST /posts/addpost", { content });
      const response = await api.post("/posts/addpost", { content });
      console.log("[posts] response:", response.data);
      setPosts((prev) => [response.data.post, ...prev]);
      setStatusMessage("Post created.");
    } catch (err) {
      console.error("[posts] error:", err?.response?.data || err);
      setStatusError(err?.response?.data?.message || "Could not create post");
    } finally {
      setPosting(false);
    }
  };

  const handleUpdatePost = async (postId, content) => {
    setStatusMessage("");
    setStatusError("");
    try {
      console.log("[posts] request: PUT /posts/editpost/:id", { postId, content });
      const response = await api.put(`/posts/editpost/${postId}`, { content });
      console.log("[posts] response:", response.data);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data.post : post))
      );
      setStatusMessage("Post updated.");
    } catch (err) {
      console.error("[posts] error:", err?.response?.data || err);
      setStatusError(err?.response?.data?.message || "Could not update post");
    }
  };

  const handleDeletePost = async (postId) => {
    setStatusMessage("");
    setStatusError("");
    try {
      console.log("[posts] request: DELETE /posts/deletepost/:id", { postId });
      const response = await api.delete(`/posts/deletepost/${postId}`);
      console.log("[posts] response:", response.data);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setStatusMessage("Post deleted.");
    } catch (err) {
      console.error("[posts] error:", err?.response?.data || err);
      setStatusError(err?.response?.data?.message || "Could not delete post");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <Spinner label="Loading feed" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white p-6 text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(statusMessage || statusError) && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            statusError
              ? "border-rose-100 bg-white text-rose-500"
              : "border-emerald-100 bg-white text-emerald-600"
          }`}
        >
          {statusError || statusMessage}
        </div>
      )}
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Feed
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Your latest posts</h1>
        <p className="text-sm text-slate-500">
          Share quick thoughts and keep your story flowing.
        </p>
      </header>

      <CreatePost onSubmit={handleCreatePost} isSubmitting={posting} />

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            No posts yet. Start the conversation.
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canEdit
              onUpdate={handleUpdatePost}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
