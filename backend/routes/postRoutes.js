const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const postController = require("../controller/postController");

router.post("/addpost", authMiddleware, postController.addPost);
router.put("/editpost/:id", authMiddleware, postController.editPost);
router.delete("/deletepost/:id", authMiddleware, postController.deletePost);

module.exports = router;
