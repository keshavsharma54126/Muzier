"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "" || password === "" || password.length < 8) {
      setError("Invalid Phone number or Password");
      return;
    }
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      router.push("/appview");
    } catch (e) {
      setError("authentication failed,Please try again");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/appview" });
  };

  return (
    <div className="min-h-screen flex px-4 sm:px-6 items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800">
      <div className="bg-gray-900 p-8  rounded-lg shadow-2xl w-full max-w-md border border-purple-500">
        <h2 className="text-3xl font-bold text-center text-purple-300 mb-8">
          Welcome to Muzer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-purple-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-purple-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Sign In
          </Button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-purple-300">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-gray-800 hover:bg-gray-700 text-purple-200 border border-purple-500">
              <FaGoogle className="mr-2" />
              Sign in with Google
            </Button>
          </div>
        </div>
        <p className="text-pink-400 ml-12 mt-2">{error}</p>
      </div>
    </div>
  );
}
