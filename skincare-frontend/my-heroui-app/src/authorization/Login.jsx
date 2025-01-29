import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithEmailAndPassword } from "../Firebase";
import AuthContext from "../Components/AuthContext/AuthContext.js";
import LoginView from "./LoginView";

function Login() {
  const navigate = useNavigate();
  const { setUserImpl } = useContext(AuthContext);

  const [user, loading, error] = useAuthState(auth);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in!");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in. Please check your credentials and try again.");
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      setUserImpl(user); // store the user in context when logged in
      navigate("/dashboard"); // redirect to dashboard if logged in
    } else {
      navigate("/"); // redirect to home if not logged in
    }
  }, [user, loading, navigate, setUserImpl]);

  if (loading) {
    return (
      <div className="wrapper">
        <p>Initializing user...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        background: `url(${pageImage}) no-repeat center center`,
        backgroundSize: "cover",
        height: "100vh",
      }}
      className="wrapper"
    >
      <LoginView onLogin={handleLogin} />
    </div>
  );
}

export default Login;
