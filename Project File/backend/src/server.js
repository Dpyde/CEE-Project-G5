import mongoose from 'mongoose'
import dotenv from 'dotenv'

import app from "./app.js";

const PORT = 3222;
dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Boon" })
    .then(() => console.log('Connected successfully to MongoDB'))
    .catch((err) => console.error('Error occurred while connecting to MongoDB', err));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Server ready at ${PORT}`);
});
