const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addComment = async (req, res) => {
  const { content, postId } = req.body;
  const authorId = req.user.postId;

  try {
    const post = await prisma.post.findFirst({
      where: { id: postId, published: true },
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unpublished." });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: authorId || null,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      select: { authorId: true },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (userRole !== "ADMIN" && comment.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments." });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

module.exports = { addComment, updateComment, deleteComment };
