const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controller/userController");

router.get("/profile", authMiddleware, userController.getProfile);
router.post("/addbio", authMiddleware, userController.addBio);
router.put("/updatebio", authMiddleware, userController.updateBio);
router.post(
  "/addprofilepic",
  authMiddleware,
  upload.single("profilepic"),
  userController.addProfilePic
);

module.exports = router;
