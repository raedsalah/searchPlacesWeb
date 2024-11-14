import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { placeId, name, latitude, longitude } = req.body;

  if (!placeId || !name || latitude === undefined || longitude === undefined) {
    res.status(400).json({
      message: "placeId, name, latitude, and longitude are required.",
    });
    return;
  }

  try {
    const conn = await pool.getConnection();

    await conn.query(
      "INSERT INTO Favorites (PlaceId, Name, Latitude, Longitude) VALUES (?, ?, ?, ?)",
      [placeId, name, latitude, longitude]
    );

    conn.release();
    res.status(201).json({ message: "Favorite added successfully." });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Favorite already exists." });
      return;
    }
    console.error("Error adding favorite:", error);
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

router.delete("/:placeId", async (req: Request, res: Response) => {
  const { placeId } = req.params;

  if (!placeId) {
    res.status(400).json({ message: "placeId is required." });
    return;
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM Favorites WHERE PlaceId = ?", [
      placeId,
    ]);
    conn.release();

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Favorite not found." });
      return;
    }

    res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    console.error("Error removing favorite:", error);
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
