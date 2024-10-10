import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetails";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => {
          console.error(err);
          setUser(null);
        });
    }
  }, [token, apiUrl]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen mx-auto flex flex-col">
        {/* Navigation */}
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              Blog
            </Link>
            {token ? (
              <nav className="flex items-center space-x-4">
                <span>{user ? `Welcome, ${user.username}` : "Loading..."}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </nav>
            ) : (
              <nav className="space-x-4">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </nav>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route
                path="/posts/:id"
                element={<PostDetail token={token} user={user} />}
              />
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route
                path="/register"
                element={<Register setToken={setToken} />}
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-blue-600 text-white py-4">
          <div className="container mx-auto text-center">
            <p>
              &copy; {new Date().getFullYear()} My Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
