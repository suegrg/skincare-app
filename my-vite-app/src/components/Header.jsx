import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Header = ({ token, onLogout }) => {
  return (
    <div className="bg-white w-full flex items-center justify-center shadow-lg rounded-b-lg border-b-4 border-gray-200 py-4">
      <div className="w-full max-w-6xl flex items-center justify-between px-6">
        <NavigationMenu>
          <NavigationMenuLink asChild>
            <Link
              to="/"
              className="text-[#333333] text-3xl font-black hover:text-[#D1C7B7] transition duration-300 ease-in-out"
            >
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenu>

        {/* SIGN IN/LOG OUT BUTTON */}
        {!token ? (
          <Link
            to="/login"
            className="text-[#333333] text-3xl font-black hover:text-[#D1C7B7] transition duration-300 ease-in-out"
          >
            Sign In
          </Link>
        ) : (
          <button
            onClick={onLogout}
            className="px-10 py-4 text-xl bg-[#D1C7B7] text-[#333333] rounded-xl font-black hover:bg-[#B9A68C] transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
