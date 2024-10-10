const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const getAllPostsForAuthor = async (req, res) => {
  const authorId = req.user.userId;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const postId = parseInt(id);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const commentsWithAuthorId = post.comments.map((comment) => ({
      ...comment,
      authorId: comment.authorId,
    }));

    res.json({ ...post, comments: commentsWithAuthorId });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const createPost = async (req, res) => {
  const { title, content, published } = req.body;
  const authorId = req.user.id;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, published },
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const togglePublish = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { published: !post.published },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

module.exports = {
  getAllPosts,
  getAllPostsForAuthor,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
};
