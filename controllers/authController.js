import User from '../model/User.js';
import jwt from 'jsonwebtoken'
import cloudinary from '../config/cloudinary.js';


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
};

export const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;


    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        console.log(req.body)
        const user = await User.create({
            fullName,
            email,
            password,
        })

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500)
            .status({ message: "Error Registring user", error: error.message })
    }

}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required " });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500)
            .status({ message: "Error Login user", error: error.message })
    }

}

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        res.status(200).json({ message: "Fetch User Successfully", user })
    } catch (error) {
        res.status(500)
            .json({ message: "Error get user", error: error.message })
    }
}

export const uploadProfile = async (req, res) => {

    try {
        console.log(req.file);
        const userId = req.user.id;
        if (!req.file) {
            throw new ApiError(400, "No file uploaded");
        }
        const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(base64Data, {
            folder: "user_profiles",
        });
        const user = await User.findByIdAndUpdate(
            userId,
            { profileImageUrl: result.secure_url },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            imageUrl: result.secure_url,
            user,
        });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(500).json({ success: false, message: "Error uploading profile image" });
    }
} 
