import express from "express";
import { FRONTEND_PORT, FRONTEND_URL } from "./public/scripts/config.js";

const app = express();

app.use(express.static("public"));

app.listen(FRONTEND_PORT, "0.0.0.0", () => {
  console.log(`Frontend Server ready at ${FRONTEND_URL}`);
});