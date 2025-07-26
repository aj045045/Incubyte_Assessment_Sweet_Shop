import { z } from "zod";

/* This block of code is defining a schema using Zod for a sign-up form. Each field in the form is
specified with certain validation rules using Zod methods. Here's a breakdown of what each field is
doing: */
export const signUpFormSchema = z.object({
    username: z.string().min(6, { message: "User name must be at least 6 characters long." }).max(50, { message: "User name cannot be longer than 50 characters." }),
    email: z.string().email({ message: "Invalid email format." }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
});

/* This block of code is defining a schema using Zod for a login form. It specifies the validation
rules for the fields in the login form. Here's a breakdown of what each field is doing: */
export const loginFormScheme = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});