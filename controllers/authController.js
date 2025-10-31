import User from '../model/User.js';
import jwt from 'jsonwebtoken'
// import router from '../routes/authRoutes';


// Generate JWT token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
};

// Regiter User

export const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;
    

    if (!fullName || !email | !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }


        // create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
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

        res.status(200).json(user)
    } catch (error) {
        res.status(500)
            .status({ message: "Error get user", error: error.message })
    }
}


