import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, [apiUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg">
            <Link to={`/posts/${post.id}`}>
              <h2 className="text-2xl font-semibold mb-2 text-blue-600 hover:underline">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-500 mb-4">
              By {post.author.username} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
