import cors from "cors";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js"
import todosRouter from "./routes/todoRoutes.js"

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5003', // Replace with your frontend's URL
    credentials: true, // Allow credentials
}));
// app.options('*', cors());
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __direname = dirname(__filename);

app.use(express.static(path.join(__direname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__direname, "public", "index.html"));
});

app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todosRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
