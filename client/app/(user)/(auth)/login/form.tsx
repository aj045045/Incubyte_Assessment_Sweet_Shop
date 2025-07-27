"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import { pageLinks } from "@/constant/page-links"
import * as z from "zod"
import { loginFormScheme } from "@/interface/form"
import { FormHandler } from "@/lib/form-handler"
import { useCallback } from "react"
import { addTokenAndRole } from "@/lib/utils"

interface LoginFormInterface {
    email: string;
    password: string;
}

interface TokenInterface {
    token: string;
    role: string;

}
/* This code snippet defines a React functional component called `LoginForm`. Here's a breakdown of
what the code is doing:
    - Get User email and Password
    - Get JWT token to store detail in the localstorage
*/

export function LoginForm() {

    const form = useForm<z.infer<typeof loginFormScheme>>({
        resolver: zodResolver(loginFormScheme),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = useCallback(async (data: LoginFormInterface) => {
        try {
            const formData = await FormHandler.onSubmitPost<TokenInterface>(
                "/api/auth/login",
                data,
                "Authenticating your credentials",
                "You're now logged in. Redirecting to your dashboard"
            );
            localStorage.setItem("token", formData.token);
            localStorage.setItem("role", formData.role);
            addTokenAndRole();
            window.location.reload();
        } catch (error) {
            console.error("Login failed:", error);
        }
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="row-span-2 py-10 mx-auto space-y-8 text-neutral-950">
                <div>
                    <div className="font-sans text-3xl">Login</div>
                    <div className="flex items-center text-sm text-neutral-600">
                        <span>Doesn&apos;t have an account yet? </span>
                        <Link href={pageLinks.sign_up}>
                            <Button variant={"link"}>Sign Up</Button>
                        </Link>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    placeholder="user@example.com"
                                    type="email"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Enter your email-id</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <PasswordInput required placeholder="U$er123" {...field} />
                            </FormControl>
                            <FormDescription>Enter your password.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>

            </form>
        </Form >
    )
}