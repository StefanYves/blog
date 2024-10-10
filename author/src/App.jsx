import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import PostManager from "./components/PostManager";
import NewPost from "./components/NewPost";
import EditPost from "./components/EditPost";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {token && (
          <nav className="bg-blue-500 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div className="space-x-4">
                <Link to="/manage" className="hover:underline">
                  Manage Posts
                </Link>
                <Link to="/new" className="hover:underline">
                  New Post
                </Link>
              </div>
              <div>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </Link>
              </div>
            </div>
          </nav>
        )}

        <div className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Login setToken={setToken} />} />
            <Route
              path="/register"
              element={<Register setToken={setToken} />}
            />
            <Route
              path="/manage"
              element={
                <ProtectedRoute token={token}>
                  <PostManager token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new"
              element={
                <ProtectedRoute token={token}>
                  <NewPost token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute token={token}>
                  <EditPost token={token} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <footer className="bg-blue-500 text-white text-center py-4 mt-8">
          <p>&copy; 2024 My Blog. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
