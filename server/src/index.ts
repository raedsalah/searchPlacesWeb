import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pool from "./config/db";

// Routes
import favoritesRouter from "./routes/favorites";
import searchRouter from "./routes/search";

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

//middlewares
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/favorites", favoritesRouter);
app.use("/api/search", searchRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Working!");
});

// start listen
app.listen(port, async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Database connected successfully");
    conn.release();
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error("Error: ", err);
  }
});
