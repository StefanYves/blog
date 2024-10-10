const express = require("express");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const postRouter = express.Router();

postRouter.get("/", postController.getAllPosts);
postRouter.get("/manage/:id", postController.getPostById);

postRouter.get(
  "/manage",
  authMiddleware.authenticate,
  authMiddleware.authorize("ADMIN"),
  postController.getAllPostsForAuthor
);
postRouter.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("ADMIN"),
  postController.createPost
);
postRouter.put(
  "/manage/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("ADMIN"),
  postController.updatePost
);
postRouter.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("ADMIN"),
  postController.deletePost
);
postRouter.patch(
  "/:id/publish",
  authMiddleware.authenticate,
  authMiddleware.authorize("ADMIN"),
  postController.togglePublish
);

postRouter.post(
  "/:postId/comments",
  authMiddleware.authenticate,
  commentController.addComment
);
postRouter.put(
  "/:postId/comments/:id",
  authMiddleware.authenticate,
  commentController.updateComment
);
postRouter.delete(
  "/:postId/comments/:id",
  authMiddleware.authenticate,
  commentController.deleteComment
);

module.exports = postRouter;
