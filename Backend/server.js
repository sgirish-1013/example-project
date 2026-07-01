const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const chatRoutes = require("./routes/chat");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 }
}));

app.use("/api", chatRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});