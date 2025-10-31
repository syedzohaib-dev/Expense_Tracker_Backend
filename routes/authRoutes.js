import express from 'express';
import { protect } from '../middleware/authMiddleware.js'

import { registerUser, loginUser, getUserInfo } from '../controllers/authController.js'
import upload from '../middleware/multerMiddleware.js';
// import { v2 as cloudinary } from "cloudinary";
import cloudinary from '../config/cloudinary.js';
import multer from "multer";




const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/getUser", protect, getUserInfo)


router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "user_profiles",
    });

    // Send response
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
})

export default router

