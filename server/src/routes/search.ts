import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM SearchHistory ORDER BY Timestamp DESC"
    );
    conn.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/all", async (req: Request, res: Response) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("TRUNCATE TABLE SearchHistory;");
    conn.release();

    res.status(200).json({ message: "Search history cleared successfully" });
  } catch (error) {
    console.error("Error clearing Search history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { placeId, name, latitude, longitude } = req.body;

  if (!placeId || !name || latitude === undefined || longitude === undefined) {
    res.status(400).json({ message: "All fields are required" });
  }

  try {
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO SearchHistory (PlaceId, Name, Latitude, Longitude) VALUES (?, ?, ?, ?)",
      [placeId, name, latitude, longitude]
    );
    conn.release();
    res.status(201).json({ message: "Search history added successfully" });
  } catch (error) {
    console.error("Error adding search history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
