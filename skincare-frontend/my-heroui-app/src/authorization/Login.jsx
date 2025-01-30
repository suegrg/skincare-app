import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      setToken(token); 
    } catch (err) {
      setError(err.message);
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
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
