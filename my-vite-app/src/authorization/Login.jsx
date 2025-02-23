import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Login({ setToken }) {
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate(); // Hook to navigate after successful login

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      setToken(token); // Update token on successful login
      navigate("/"); // Navigate back to the homepage
    } catch (err) {
      console.error("Google authentication failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Header at the top of the screen */}
      <Header />

      {/* Centered sign-in/sign-up section */}
      <div className="flex flex-1 items-center justify-center -mt-32">
        {" "}
        {/* Increased negative margin to -mt-32 */}
        <div className="w-full max-w-sm p-6">
          <h1 className="text-4xl font-bold text-black text-center">
            clean. skin. clean skin. care.
          </h1>
          <p className="mt-2 text-lg text-black text-center">
            Find the best clean skincare products and customer reviews.
          </p>

          <div className="flex flex-col items-center mt-8">
            <button
              onClick={handleGoogleAuth}
              className="w-full max-w-lg py-2 px-4 border border-[#D1C7B7] text-[#333333] rounded-md font-semibold text-sm leading-5 hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200"
            >
              Sign in
            </button>

            <button
              onClick={handleGoogleAuth}
              className="w-full max-w-lg py-2 px-4 mt-4 border border-[#D1C7B7] text-[#333333] rounded-md font-semibold text-sm leading-5 hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200"
            >
              Or register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
