"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";

const GoogleSignIn = dynamic(() => import("@/components/google-signIn"), {
  ssr: false,
});

const LoginPage = () => {
  const { handleLogin, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
      {error && <p>{error}</p>}
      <GoogleSignIn />
    </form>
  );
};

export default LoginPage;
