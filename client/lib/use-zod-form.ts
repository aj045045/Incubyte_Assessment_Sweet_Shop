import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * The `useZodForm` function in TypeScript is used to create a form hook with Zod schema validation.
 * @param {TSchema} schema - The `schema` parameter in the `useZodForm` function is a Zod schema that
 * defines the shape and validation rules for the form data. It is a generic type `TSchema` that
 * extends `ZodType<any, any>`, meaning it can be any Zod schema type
 * @param [options] - The `options` parameter in the `useZodForm` function is an optional parameter
 * that allows you to provide additional configuration options for the form. It is of type
 * `Omit<UseFormProps<z.infer<TSchema>>, "resolver">`, which means it should contain all the properties
 * @returns The `useZodForm` function returns a custom hook that can be used to create forms based on a
 * Zod schema. It takes a Zod schema as the first argument and an optional options object as the second
 * argument. The function then internally uses the `useForm` hook from a form library (presumably React
 * Hook Form) to handle form state and validation. The Zod schema is
 */
export function useZodForm<TSchema extends ZodType<any, any>>(
    schema: TSchema,
    options?: Omit<
        UseFormProps<z.infer<TSchema>>,
        "resolver"
    >
): UseFormReturn<z.infer<TSchema>, any, z.infer<TSchema>> {
    return useForm<z.infer<TSchema>, any, z.infer<TSchema>>({
        resolver: zodResolver(schema) as any,
        ...options,
    });
}
