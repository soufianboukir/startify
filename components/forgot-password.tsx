"use client";

import React, { FormEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import Link from "next/link";
import { api } from "@/config/api";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsSent(false)
    setError("");
    try {
        const response = await api.post(`/forgot-password`,{email});
        if(response.status === 200){
          setIsSent(true)
        }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false)
    }
  };
  return (
    <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">Forgot password</CardTitle>
            <CardDescription>
                Enter your email associated with your account
            </CardDescription>
            {
                error && <div className="text-red-600 text-center">{error}</div>
            }
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {
                          isSent && <div className="text-green-600 text-sm">If email exists in our system, a reset link was sent</div>
                        }
                    </div>
                    <Button disabled={loading} className="w-full cursor-pointer">
                        {
                            loading ? <Loader className="w-8 h-8 animate-spin"/>: "Send reset link"
                        }
                    </Button>
                </div>
            </form>
            <Link href={'/login'} className="float-right mt-2 underline">
                Login
            </Link>
        </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;