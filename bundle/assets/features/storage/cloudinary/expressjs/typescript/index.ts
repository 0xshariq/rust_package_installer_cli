import { appendFile } from "fs";
import cloudinaryRoutes from "./routes/cloudinaryRoutes";

app.use("/api/cloudinary", cloudinaryRoutes);