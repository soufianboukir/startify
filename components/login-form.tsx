'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { PasswordInput } from "./ui/password-input"
import { FormEvent, useState } from "react"
import { Loader } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export function LoginForm() {

    const [loading,setLoading] = useState(false)
    const [oAuthLoading,setOAuthLoading] = useState(false)
    const [error,setError] = useState('')
    const router = useRouter()
    const [formData,setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value,
          
        }));
    };
    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });
        
            if (result?.error) {
                setError(result.error);
                toast.error("Login failed: " + result.error);
            } else {
                toast.success("Logged in successfully");
                router.push("/dashboard"); 
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    async function handleGoogleOAuth() {
        setOAuthLoading(true);
        await signIn("google", { callbackUrl: "/redirecting" });
        setOAuthLoading(false);
      }
  return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
                <CardDescription>
                    Log in or create an account with Google
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
                            value={formData.email}
                            onChange={handleChange}
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                            href="/forgot-password"
                            className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                            >
                            Forgot your password?
                            </Link>
                        </div>
                        <PasswordInput name="password" value={formData.password} onChange={handleChange} placeholder="*******"/>
                        </div>
                        <Button disabled={loading} className="w-full cursor-pointer">
                            {
                                loading ? <Loader className="w-8 h-8 animate-spin"/>: "Login"
                            }
                        </Button>
                    </div>
                </form>
                <Button variant="outline" className="w-full mt-8 cursor-pointer" onClick={handleGoogleOAuth} disabled={oAuthLoading}>
                    {
                        oAuthLoading ?
                        <Loader className="w-8 h-8 animate-spin"/>:
                        <>
                            <Image src={'/icons/google.svg'} width={25} height={25} alt="google icon"/>
                            Sign in with google
                        </>
                    }
                </Button>
            </CardContent>
        </Card>
  )
}
