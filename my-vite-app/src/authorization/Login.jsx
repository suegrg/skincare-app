import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const auth = getAuth();

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please provide both email and password.");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      setToken(token);
    } catch (err) {
      setError("Failed to sign in, please check your credentials.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please provide both email and password.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      setToken(token);
    } catch (err) {
      setError("Error during sign-up.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      setToken(token);
    } catch (err) {
      setError("Error with Google login.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-xl">
        {/* Header Content */}
        <header className="bg-teal-500 text-black py-6 px-4 w-full text-center">
          <div className="max-w-7xl mx-auto">
            {/* Centered Content */}
            <h1 className="text-4xl font-bold text-black">
              clean. skin. clean skin. care.
            </h1>
            <p className="mt-2 text-lg text-black">
              Find the best clean skincare products and customer reviews.
            </p>
          </div>
        </header>

        <h2 className="text-3xl font-semibold text-center text-teal-600 mb-8">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300 ease-in-out"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-black p-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-blue-500 text-black p-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Sign in with Google
        </button>

        {/* Switch between SignUp and Login */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-teal-500 font-semibold"
          >
            {isSignup ? "Log in here" : "Sign up here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
