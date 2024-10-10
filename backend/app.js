require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/authRoute");
const postRouter = require("./routes/postRoute");
const commentRouter = require("./routes/commentRoute");
const passport = require("passport");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
