import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const EditPost = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/posts/manage/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPost({ title: data.title, content: data.content });
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id, token, apiUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/api/posts/manage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Post updated successfully!");
        navigate("/manage");
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      fetch(`${apiUrl}/api/posts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setComments((prev) =>
              prev.filter((comment) => comment.id !== commentId)
            );
          } else {
            console.error("Failed to delete comment.");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            placeholder="Post Title"
            required
            className="w-full p-3 border rounded mb-4"
          />
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            placeholder="Post Content"
            required
            className="w-full p-3 border rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600"
          >
            Update Post
          </button>
        </form>
        <Link
          to="/manage"
          className="block mt-4 text-center text-blue-500 hover:underline"
        >
          Go back home
        </Link>

        <h3 className="text-xl font-bold mt-8 mb-4">Comments</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="mb-4">
              <p>{comment.content}</p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 hover:underline"
              >
                Delete Comment
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditPost;
