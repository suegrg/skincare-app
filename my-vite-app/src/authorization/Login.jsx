import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export default function Login({ setToken }) {
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      setToken(token);
    } catch (err) {
      console.error("Google authentication failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToken(null);
      console.log("User logged out");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7]">
      <div className="sm:w-full sm:max-w-sm p-6">
        <h1 className="text-4xl font-bold text-black text-center">
          clean. skin. clean skin. care.
        </h1>
        <p className="mt-2 text-lg text-black text-center">
          Find the best clean skincare products and customer reviews.
        </p>

        <div className="flex flex-col items-center">
          <button
            onClick={handleGoogleAuth}
            className="w-full max-w-lg py-2 px-4 mt-4 border border-[#D1C7B7] text-[#333333] rounded-md font-semibold text-sm leading-5 hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200"
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
  );
}
