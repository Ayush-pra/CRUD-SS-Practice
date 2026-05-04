import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner.jsx";

const UploadProfilePic = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("profilepic");
    const file = input?.files?.[0];

    if (!file) {
      setError("Please select an image.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("profilepic", file);
      console.log("[profilepic] request: POST /users/addprofilepic", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      const response = await api.post("/users/addprofilepic", formData);
      console.log("[profilepic] response:", response.data);
      const uploadedUrl = response?.data?.profile?.profilepic;
      setSuccess("Profile picture updated.");
      setTimeout(() => navigate("/profile", { state: { profilepic: uploadedUrl } }), 300);
    } catch (err) {
      console.error("[profilepic] error:", err?.response?.data || err);
      setError(err?.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Profile picture
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Upload a new photo</h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose a square image so it fits cleanly in the profile ring.
        </p>

        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-xs font-semibold uppercase tracking-widest text-slate-500 transition hover:border-slate-300">
            <input
              type="file"
              name="profilepic"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploading ? "Uploading..." : "Choose image"}
          </label>

          {preview ? (
            <div className="flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="h-40 w-40 rounded-full object-cover"
              />
            </div>
          ) : null}

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {uploading ? "Uploading..." : "Save photo"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-xs font-semibold uppercase tracking-widest text-slate-500"
            >
              Cancel
            </button>
          </div>

          {uploading ? <Spinner label="Uploading" /> : null}
        </form>
      </div>
    </div>
  );
};

export default UploadProfilePic;
