import express from "express";
import cors from "cors";

import RoomRoute from "./routes/roomRoute.js";

const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/rooms", RoomRoute);

export default app;
