import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

//middlewares
app.use(cors());
app.use(bodyParser.json());

// routes
app.get("/", (req: Request, res: Response) => {
  res.send("Working!");
});

// start listen
app.listen(port, async () => {
  try {
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error("Error: ", err);
  }
});
