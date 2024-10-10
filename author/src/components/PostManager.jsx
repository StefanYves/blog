import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostManager = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/posts/manage`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
          console.error("Unexpected response format:", data);
        }
      })
      .catch((err) => console.error(err));
  }, [token, apiUrl]);

  const togglePublish = (id) => {
    fetch(`${apiUrl}/api/posts/${id}/publish`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        setPosts((prev) =>
          prev.map((post) => (post.id === id ? updatedPost : post))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`${apiUrl}/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setPosts((prev) => prev.filter((post) => post.id !== id));
          } else {
            console.error("Failed to delete post.");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Manage Posts</h2>
        <Link
          to="/new"
          className="block mb-4 text-blue-500 text-center hover:underline"
        >
          Create New Post
        </Link>
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-4 border-b pb-4">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p>Published: {post.published ? "Yes" : "No"}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => togglePublish(post.id)}
                  className="text-blue-500 hover:underline"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
                <Link
                  to={`/edit/${post.id}`}
                  className="text-green-500 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostManager;
