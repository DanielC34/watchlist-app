"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const csrf_1 = __importDefault(require("./routes/csrf"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const watchlist_1 = __importDefault(require("./routes/watchlist"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = [
    "http://localhost:5173",
    "https://filmvault-frontend.onrender.com",
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URI;
if (!sessionSecret || !mongoUri) {
    throw new Error("SESSION_SECRET and MONGO_URI must be defined");
}
app.use((0, express_session_1.default)({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({ mongoUrl: mongoUri }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use("/api", csrf_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/user", user_1.default);
app.use("/api/watchlist", watchlist_1.default);
const start = async () => {
    await (0, db_1.default)();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
void start();
