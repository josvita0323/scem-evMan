"use client";

import React, { useState, useEffect } from "react";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaCheckCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchMessage, setMatchMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.replace("/");
  }, [isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchMessage("");
    setError("");

    if (password !== confirmPassword) {
      setMatchMessage("Passwords do not match");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email address");
      return;
    }

    if (!isLoaded || isSignedIn) return;

    try {
      setLoading(true);

      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.push("/auth/verify-email");
    } catch (err: any) {
      const errMsg = err.errors?.[0]?.message || "Registration failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded || isSignedIn) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Google sign-up failed", err);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center p-0">
      <div className="absolute top-0 left-0 w-full h-1/3 z-15">
        <svg
          viewBox="0 0 24 10"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 0 L 24 0 L 24 4 C 18 8 11 4 0 2 Z"
            fill="var(--color-primary)"
            stroke="var(--color-primary)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="z-30 grid w-full h-full grid-cols-1 md:grid-cols-2 relative">
        {/* Left Side (Form) */}
        <div className="flex items-center justify-center px-4 sm:px-10 py-8 order-2 md:order-1">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground z-40">
                SIGN UP
              </h1>
              <div className="h-1 w-24 bg-primary rounded-full" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <p className="text-right text-foreground text-sm">
                Already a User?{" "}
                <Link
                  className="hover:underline text-primary"
                  href="/auth/login"
                >
                  Login
                </Link>
              </p>

              <div className="relative">
                <MdEmail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-Mail ID"
                  className="pl-12 pr-4 py-3 bg-muted text-foreground placeholder:text-muted-foreground"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <RiLockPasswordFill
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-12 pr-4 py-3 bg-muted text-foreground placeholder:text-muted-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <FaCheckCircle
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-12 pr-4 py-3 bg-muted text-foreground placeholder:text-muted-foreground"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {(matchMessage || error) && (
                <p
                  className={`text-right text-sm transition-all ${
                    matchMessage.includes("not") || error
                      ? "text-destructive"
                      : "text-green-600"
                  }`}
                >
                  {matchMessage || error}
                </p>
              )}

              <div id="clerk-captcha"></div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Continue"}
                </Button>

                <div className="flex items-center my-2">
                  <hr className="flex-grow border-muted" />
                  <span className="px-4 text-sm text-muted-foreground">OR</span>
                  <hr className="flex-grow border-muted" />
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center w-full gap-3 bg-background border-2 border-input text-foreground rounded-md py-3 hover:bg-accent cursor-pointer z-40"
                  variant="outline"
                >
                  <FcGoogle size={20} />
                  Continue With Google
                </Button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              ©2025 All rights reserved
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center order-1 md:order-2"></div>
      </div>
    </main>
  );
}
