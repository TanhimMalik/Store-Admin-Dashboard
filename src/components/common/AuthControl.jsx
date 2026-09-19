import { useState } from "react";
import { createPortal } from "react-dom";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({ onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 p-8 rounded-lg w-full max-w-sm text-white"
      >
        <h3 className="text-xl font-semibold mb-6 text-center">Admin Sign In</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
          autoFocus
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-500 bg-gray-800 text-white mb-4 p-2 w-full rounded-lg"
          required
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
};

const AuthControl = ({ isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="mt-auto pt-2 border-t border-gray-700">
      {user ? (
        <button
          onClick={logout}
          className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors w-full"
        >
          <LogOut size={20} style={{ minWidth: "20px" }} />
          {isSidebarOpen && (
            <span className="ml-4 whitespace-nowrap truncate">Sign Out</span>
          )}
        </button>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors w-full"
        >
          <LogIn size={20} style={{ minWidth: "20px" }} />
          {isSidebarOpen && (
            <span className="ml-4 whitespace-nowrap">Admin Sign In</span>
          )}
        </button>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default AuthControl;
