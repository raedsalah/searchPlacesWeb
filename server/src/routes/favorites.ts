import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { placeId } = req.body;

  if (!placeId) {
    res.status(400).json({ message: "placeId is required" });
  }

  try {
    const conn = await pool.getConnection();
    await conn.query("INSERT INTO Favorites (PlaceId) VALUES (?)", [placeId]);
    conn.release();
    res.status(201).json({ message: "Favorite added successfully" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/", async (req: Request, res: Response) => {
  const { placeId } = req.body;

  if (!placeId) {
    res.status(400).json({ message: "placeId is required" });
    return;
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM Favorites WHERE PlaceId = ?", [
      placeId,
    ]);
    conn.release();

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Favorite not found" });
      return;
    }

    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/all", async (req: Request, res: Response) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("TRUNCATE TABLE Favorites;");
    conn.release();

    res.status(200).json({ message: "Favorite cleared successfully" });
  } catch (error) {
    console.error("Error clearing favorite:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Favorites");
    conn.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
