import express from "express";
import "dotenv/config";
import fileUpload from "express-fileupload";
// userd to give access to resources from other domains
import cors from "cors";
// used to secure the application by setting various HTTP headers
import helmet from "helmet";
import {limiter} from "./config/ratelimiter.js";

const app = express();

const PORT = process.env.PORT || 8000;


// * Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cors(
  // origin:"https://news.com",
));

app.use(helmet());
app.use(limiter);
// to allow resources available to outside World in public folder 
app.use(express.static("public"));

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