import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 shadow-xl bg-base-100 rounded-3xl p-6">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        <form className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text text-lg">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
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

          <Link 
          to="/games" 
          type="submit" 
          className="btn btn-primary w-full">
          Login
          </Link>

          <button type="button" className="btn btn-outline w-full">
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;