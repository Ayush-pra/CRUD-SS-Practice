const pool = require("../config/db");
const minioClient = require("../config/minio");
const { v4: uuidv4 } = require("uuid");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userResult = await pool.query(
      `SELECT id, username, name, age, email, profilepic, bio_content, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const postsResult = await pool.query(
      `SELECT id, user_id, content, created_at, updated_at
       FROM posts
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      user: userResult.rows[0],
      posts: postsResult.rows,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addBio = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { bio_content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof bio_content !== "string" || bio_content.trim().length === 0) {
      return res.status(400).json({ message: "Bio content is required" });
    }

    const result = await pool.query(
      `UPDATE users
       SET bio_content = $1
       WHERE id = $2
       RETURNING id, bio_content`,
      [bio_content.trim(), userId]
    );

    return res.status(200).json({
      message: "Bio added successfully",
      bio: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateBio = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { bio_content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof bio_content !== "string" || bio_content.trim().length === 0) {
      return res.status(400).json({ message: "Bio content is required" });
    }

    const result = await pool.query(
      `UPDATE users
       SET bio_content = $1
       WHERE id = $2
       RETURNING id, bio_content`,
      [bio_content.trim(), userId]
    );

    return res.status(200).json({
      message: "Bio updated successfully",
      bio: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addProfilePic = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile image file is required" });
    }

    const file = req.file;
    const bucket = process.env.MINIO_BUCKET;

    const fileName = `${uuidv4()}-${file.originalname}`;

    // 1️⃣ Upload file to MinIO
    await minioClient.putObject(
      bucket,
      fileName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      }
    );

    // 2️⃣ Generate public URL
    const profileUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${fileName}`;

    // 3️⃣ Save URL in PostgreSQL
    const result = await pool.query(
      `UPDATE users
       SET profilepic = $1
       WHERE id = $2
       RETURNING id, profilepic`,
      [profileUrl, userId]
    );

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profile: result.rows[0],
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};