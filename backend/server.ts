import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import csrfRoutes from "./routes/csrf";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import watchlistRoutes from "./routes/watchlist";
import connectDB from "./config/db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://filmvault-frontend.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URI;

if (!sessionSecret || !mongoUri) {
  throw new Error("SESSION_SECRET and MONGO_URI must be defined");
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoUri }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/api", csrfRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/watchlist", watchlistRoutes);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void start();
