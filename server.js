import express from "express";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 8000;


// * Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});


// * Import routes
import ApiRoutes from "./routes/api.js";
app.use("/api", ApiRoutes, (req, res) => {
  return res.status(404).json({ message: "Not found" });
} );


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    throw err;
  }
});