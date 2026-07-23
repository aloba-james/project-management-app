import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ROUTE IMPORTS
import projectRoutes from "./routes/projectRoutes";
import tasksRoutes from "./routes/tasksRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import commentRoutes from "./routes/commentRoutes";
import attachmentRoutes from "./routes/attachmentRoutes";
import { uploadsDir } from "./controllers/attachmentController";

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/uploads", express.static(uploadsDir));

// ROUTES
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/projects", projectRoutes);
app.use("/tasks", tasksRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/comments", commentRoutes);
app.use("/attachments", attachmentRoutes);

// SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
