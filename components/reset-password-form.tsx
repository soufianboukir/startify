"use client";

import React, { FormEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import Link from "next/link";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import z from "zod";
import { PasswordInput } from "./ui/password-input";
import { api } from "@/config/api";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    r_password: z.string().min(6, "Please retype your password"),
  })
  .refine(data => data.password === data.r_password, {
    message: "Passwords do not match",
    path: ["r_password"],
  });

type ResetPasswordErrors = {
  password?: string;
  r_password?: string;
};

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isReseted,setIsReseted] = useState(false)
  const searchParams = useSearchParams()
  const [errors, setErrors] = useState<ResetPasswordErrors>({ password: "", r_password: "" });
  const [formData, setFormData] = useState({
    password: "",
    r_password: "",
  });
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('')
    setErrors({
      password: '',
      r_password: ''
    })
    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        password: fieldErrors.password?.[0],
        r_password: fieldErrors.r_password?.[0],
      });
      return;
    }
    if (!result.success) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`/reset-password`,{email,token,password: formData.password,confirmPassword: formData.r_password})

      if(response.status === 200){
        setIsReseted(true)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
    
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError(axiosError.message);
        }
    
      } else if (err instanceof Error) {
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
                <CardTitle className="text-xl">Reset password</CardTitle>
                <CardDescription>Create a new password for your account</CardDescription>
                {error && <div className="mb-2 text-center text-red-600">{error}</div>}
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">

                        <div className="grid gap-6">
                            <div className="grid gap-1">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                name="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                                />
                                {errors.password && (
                                <div className="text-sm text-red-600">{errors.password}</div>
                                )}
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="r_password">Retype password</Label>
                                <PasswordInput
                                name="r_password"
                                placeholder="********"
                                value={formData.r_password}
                                onChange={handleChange}
                                />
                                {errors.r_password && (
                                <div className="text-sm text-red-600">{errors.r_password}</div>
                                )}
                                {
                                  isReseted && <div className="text-green-600 text-sm">Password has been reseted successfully</div>
                                }
                            </div>
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? (
                                <div>
                                    <Loader className="animate-spin w-8 h-8" />
                                </div>
                                ) : (
                                "Update password"
                                )}
                            </Button>
                            <div className="flex justify-end gap-3">
                                <Link href={"/login"} className="duration-200 hover:underline">
                                Back to login
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
  );
};

export default ResetPasswordForm;