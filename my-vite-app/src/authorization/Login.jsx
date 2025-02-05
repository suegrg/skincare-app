import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const auth = getAuth();

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!auth) {
      setError("Authentication service is not available.");
      return;
    }

    try {
      // Ensure email and password are not empty
      if (!email || !password) {
        setError("Please provide both email and password.");
        return;
      }

      // Use Popup authentication instead of the redirect flow (avoids iframe issues)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential && userCredential.user) {
        const token = await userCredential.user.getIdToken();
        setToken(token); // Passing the token to the parent component
      } else {
        setError("Failed to retrieve user information.");
      }
    } catch (err) {
      // Handle specific Firebase authentication errors
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please check your credentials.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      setToken(token); // Set the token in the parent component
    } catch (err) {
      console.error("Google login error:", err);
      setError("An error occurred with Google login. Please try again later.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-teal-500 text-black px-4 py-2 rounded-lg hover:bg-teal-600"
        >
          Sign In
        </button>
      </form>

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
