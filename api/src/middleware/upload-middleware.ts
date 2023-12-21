import multer from "multer"

export const uploadMiddleware = multer({ dest: "/tmp/uploads" })

export default uploadMiddleware
