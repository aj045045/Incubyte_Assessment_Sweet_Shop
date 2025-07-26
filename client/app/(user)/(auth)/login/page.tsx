import { assetsLinks } from "@/constant/assets-links";
import Image from "next/image";
import { LoginForm } from "./form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
};

/**
 * The LoginPage component renders a login form alongside an image in a responsive grid layout.
 * @returns The `LoginPage` component is being returned. It consists of a `div` element with a class
 * name of "flex items-center justify-center min-h-screen" containing a grid layout with two columns.
 * The first column contains an image section with a background color of "bg-lime-700" and the second
 * column contains a `LoginForm` component.
 */
export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="grid w-4/5 max-w-4xl grid-cols-1 overflow-hidden rounded-xl md:grid-cols-2 bg-lime-50 shadow-xl border border-neutral-600">
                {/* Image Section */}
                <div className="flex items-center justify-center p-10 bg-lime-700 md:rounded-l-xl rounded-t-xl md:rounded-t-none">
                    <Image
                        src={assetsLinks.login.src}
                        alt={assetsLinks.login.alt}
                        width={500}
                        height={500}
                        className="rounded-xl max-w-80"
                        priority
                    />
                </div>
                <div className="p-6">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}