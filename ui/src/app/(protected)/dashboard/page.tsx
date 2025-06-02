"use client";

import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement the logout logic here, such as clearing tokens or user data
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
