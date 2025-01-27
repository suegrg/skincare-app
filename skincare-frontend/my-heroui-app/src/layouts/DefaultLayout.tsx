import React from "react";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-500 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">Clean Skincare Finder</h1>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-gray-800 text-gray-300 text-center py-4">
        <p>© 2025 Clean Skincare Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DefaultLayout;
