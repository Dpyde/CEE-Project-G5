import express from "express";
import cors from "cors";

import GameController from './controllers/gameController.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/", GameController);

export default app;
