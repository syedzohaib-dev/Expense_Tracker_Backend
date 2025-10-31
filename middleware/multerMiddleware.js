// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });
// export default upload;


import multer from "multer";

const storage = multer.memoryStorage(); // stores file in buffer

const upload = multer({ storage });

export default upload;
