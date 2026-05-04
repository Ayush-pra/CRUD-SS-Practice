import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner.jsx";
import PostCard from "../components/PostCard.jsx";
import CreatePost from "../components/CreatePost.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bioInput, setBioInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingBio, setSavingBio] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const normalizeProfileUrl = (url) => {
    if (!url) return url;
    if (url.includes(":9001")) {
      return url.replace(":9001", ":9000");
    }
    return url;
  };

  const withCacheBuster = (url) => {
    if (!url) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${Date.now()}`;
  };

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("[profile] request: GET /users/profile");
      const response = await api.get("/users/profile");
      console.log("[profile] response:", response.data);
      const nextUser = { ...response.data.user };
      if (nextUser.profilepic) {
        nextUser.profilepic = withCacheBuster(normalizeProfileUrl(nextUser.profilepic));
      }
      setUser(nextUser);
      setPosts(response.data.posts || []);
      setBioInput(response.data.user?.bio_content || "");
    } catch (err) {
      console.error("[profile] error:", err?.response?.data || err);
      if (err?.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const uploadedUrl = location.state?.profilepic;
    if (uploadedUrl && user) {
      const normalized = withCacheBuster(normalizeProfileUrl(uploadedUrl));
      setUser((prev) => ({ ...prev, profilepic: normalized }));
    }
  }, [location.state, user]);

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

  const handleSaveBio = async () => {
    if (!bioInput.trim()) {
      return;
    }
    setSavingBio(true);
    setStatusMessage("");
    setStatusError("");
    try {
      const endpoint = user?.bio_content ? "/users/updatebio" : "/users/addbio";
      const payload = { bio_content: bioInput };
      console.log(`[bio] request: ${endpoint}`, payload);
      const response = await api[endpoint === "/users/updatebio" ? "put" : "post"](
        endpoint,
        payload
      );
      console.log("[bio] response:", response.data);
      setUser((prev) => ({ ...prev, bio_content: response.data.bio.bio_content }));
      setStatusMessage("Bio saved.");
      setIsEditingBio(false);
    } catch (err) {
      console.error("[bio] error:", err?.response?.data || err);
      setStatusError(err?.response?.data?.message || "Could not save bio");
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <Spinner label="Loading profile" />
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
    <div className="space-y-8">
      {(statusMessage || statusError) && (
        <div
          className={`rounded-2xl border px-5 py-3 text-sm ${
            statusError
              ? "border-rose-100 bg-white text-rose-500"
              : "border-emerald-100 bg-white text-emerald-600"
          }`}
        >
          {statusError || statusMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="h-28 bg-[radial-gradient(circle_at_top,_#e2e8f0,_#f8fafc)]" />
        <div className="-mt-10 flex flex-col gap-6 px-6 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <button
              type="button"
              onClick={() => {
                if (user?.profilepic) {
                  setShowAvatarModal(true);
                }
              }}
              className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm"
            >
              {user?.profilepic ? (
                <img
                  src={user.profilepic}
                  alt={user.username}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "https://placehold.co/160x160?text=User";
                  }}
                />
              ) : null}
            </button>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">@{user?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {posts.length} posts
            </span>
          </div>
        </div>
        <div className="grid gap-6 border-t border-slate-100 px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Bio
            </p>
            {user?.bio_content && !isEditingBio ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-700">{user.bio_content}</p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:text-slate-900"
                >
                  Edit bio
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={bioInput}
                  onChange={(event) => setBioInput(event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  placeholder="Add a short bio"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveBio}
                    disabled={savingBio}
                    className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {savingBio ? "Saving..." : "Save bio"}
                  </button>
                  {user?.bio_content ? (
                    <button
                      onClick={() => {
                        setBioInput(user?.bio_content || "");
                        setIsEditingBio(false);
                      }}
                      className="text-xs font-semibold uppercase tracking-widest text-slate-500"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            )}
            {!user?.bio_content && !isEditingBio ? (
              <button
                onClick={() => setIsEditingBio(true)}
                className="text-xs font-semibold uppercase tracking-widest text-slate-600 underline decoration-slate-300 underline-offset-4"
              >
                Add bio
              </button>
            ) : null}
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Profile picture
            </p>
            <Link
              to="/profile/picture"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:text-slate-900"
            >
              Add profile picture
            </Link>
            <p className="text-xs text-slate-400">Upload a square photo for best fit.</p>
          </div>
        </div>
      </section>

      {showAvatarModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
          onClick={() => setShowAvatarModal(false)}
        >
          <div className="h-80 w-80 overflow-hidden rounded-full">
            <img
              src={user?.profilepic}
              alt={user?.username}
              className="h-full w-full object-cover"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      ) : null}

      <section className="space-y-6">
        <CreatePost onSubmit={handleCreatePost} isSubmitting={posting} />
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              No posts yet. Share your first update.
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
      </section>
    </div>
  );
};

export default Profile;
