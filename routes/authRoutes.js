import express from 'express';
import { protect } from '../middleware/authMiddleware.js'

import { registerUser, loginUser, getUserInfo, uploadProfile } from '../controllers/authController.js'
import upload from '../middleware/multerMiddleware.js';



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/getUser", protect, getUserInfo)
router.post("/uploadprofile", protect, upload.single("image"), uploadProfile);




export default router

