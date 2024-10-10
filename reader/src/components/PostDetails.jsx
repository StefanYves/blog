import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PostDetail = ({ token, user }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/posts/manage/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error(err));
  }, [id, apiUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: comment,
        postId: parseInt(id),
        authorId: user ? user.id : null,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add comment");
        }
        return res.json();
      })
      .then((data) => {
        setPost((prev) => ({
          ...prev,
          comments: [...prev.comments, data],
        }));
        setComment("");
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (commentId) => {
    fetch(`${apiUrl}/api/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete comment");
        }
        return res.json();
      })
      .then(() => {
        setPost((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId),
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (commentId) => {
    const commentToEdit = post.comments.find((c) => c.id === commentId);
    if (commentToEdit) {
      setEditMode(true);
      setCurrentCommentId(commentId);
      setEditCommentContent(commentToEdit.content);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/api/posts/${id}/comments/${currentCommentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: editCommentContent,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update comment");
        }
        return res.json();
      })
      .then(() => {
        setPost((prev) => ({
          ...prev,
          comments: prev.comments.map((c) =>
            c.id === currentCommentId
              ? { ...c, content: editCommentContent }
              : c
          ),
        }));
        setEditMode(false);
        setEditCommentContent("");
        setCurrentCommentId(null);
      })
      .catch((err) => console.error(err));
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-4">
          By {post.author.username} on{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="prose max-w-none mb-8">{post.content}</div>
        <hr />
        <h3 className="text-2xl font-semibold mb-4">Comments</h3>
        {post.comments.map((c) => (
          <div key={c.id} className="mb-6">
            <p>{c.content}</p>
            <p className="text-gray-500 text-sm">
              By {c.author ? c.author.username : "Anonymous"} on{" "}
              {new Date(c.createdAt).toLocaleDateString()}
            </p>
            {user && user.id === c.authorId && (
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(c.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
            <hr />
          </div>
        ))}
        {editMode ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <textarea
              value={editCommentContent}
              onChange={(e) => setEditCommentContent(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Edit your comment"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Update
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="text-red-600 ml-4"
            >
              Cancel
            </button>
          </form>
        ) : token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Add a comment"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Submit
            </button>
          </form>
        ) : (
          <p>You must be logged in to add a comment.</p>
        )}
        <Link to="/" className="text-blue-600 hover:underline mt-8 block">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
