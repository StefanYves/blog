const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const commentRouter = express.Router();

commentRouter.post(
  "/",
  authMiddleware.authenticate,
  commentController.addComment
);

module.exports = commentRouter;
