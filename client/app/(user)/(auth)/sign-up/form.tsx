"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import { pageLinks } from "@/constant/page-links"
import { FormHandler } from "@/lib/form-handler"
import { User } from "lucide-react"
import { useZodForm } from "@/lib/use-zod-form"
import { signUpFormSchema } from "@/interface/form";
import * as z from "zod";

/* This code snippet defines a functional component called `SignUpForm` in TypeScript React. */
export function SignUpForm() {
    const form = useZodForm(signUpFormSchema, { defaultValues: { email: "", password: "", username: "", } });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((payload) => FormHandler.onSubmitPost<z.infer<typeof signUpFormSchema>>("/api/auth/register", payload, "Submitting registration request", "You have successfully signed up. Try logging in now."))}
                className="row-span-2 py-10 mx-auto space-y-8 text-neutral-950">
                <div>
                    <div className="font-sans text-3xl">Sign Up</div>
                    <div className="flex items-center text-sm text-neutral-600">
                        <span>Already have an account? </span>
                        <Link href={pageLinks.login}>
                            <Button variant={"link"}>Login</Button>
                        </Link>
                    </div>
                </div>

                {/* NOTE Username */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Username <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                    </span>
                                    <Input
                                        placeholder="johnwick"
                                        required
                                        type="text"
                                        className="pl-10" // Add padding to the left for the icon
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>Enter your user name</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* NOTE Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    required
                                    placeholder="johnwick@example.com"
                                    type="email"
                                    {...field} />
                            </FormControl>
                            <FormDescription>Enter your email-id</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* NOTE Password */}
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
