const pool = require("../config/db");

exports.addPost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    const result = await pool.query(
      `INSERT INTO posts (user_id, content)
       VALUES ($1, $2)
       RETURNING id, user_id, content, created_at, updated_at`,
      [userId, content.trim()]
    );

    return res.status(201).json({
      message: "Post created successfully",
      post: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.editPost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const postId = Number.parseInt(req.params.id, 10);
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    const updateResult = await pool.query(
      `UPDATE posts
       SET content = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING id, user_id, content, created_at, updated_at`,
      [content.trim(), postId, userId]
    );

    if (updateResult.rows.length === 0) {
      const existsResult = await pool.query(
        `SELECT id FROM posts WHERE id = $1`,
        [postId]
      );

      if (existsResult.rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post: updateResult.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const postId = Number.parseInt(req.params.id, 10);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const deleteResult = await pool.query(
      `DELETE FROM posts
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [postId, userId]
    );

    if (deleteResult.rows.length === 0) {
      const existsResult = await pool.query(
        `SELECT id FROM posts WHERE id = $1`,
        [postId]
      );

      if (existsResult.rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
