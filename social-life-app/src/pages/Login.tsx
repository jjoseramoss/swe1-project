import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email/Password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate("/profile");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 shadow-xl bg-base-100 rounded-3xl p-6">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="label">
              <span className="label-text text-lg">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-lg">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="label cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm mr-2" />
              Remember me
            </label>
            <a href="#" className="link link-hover text-secondary">
              Forgot password
            </a>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Sign in with Google
          </button>
           <div className="text-center mt-3">
            <span>Don't have an account? </span>
              <Link to="/signup" className="link text-secondary">
                Create account
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
