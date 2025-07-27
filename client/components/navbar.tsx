"use client";

import { useEffect, useState } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { LucideMenu } from "lucide-react";
import Image from "next/image";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { SearchBarComp } from "./search";
import { assetsLinks } from "@/constant/assets-links";
import { pageLinks } from "@/constant/page-links";
import { Home, Search } from "lucide-react";
import { Button } from "./ui/button";
import { removeTokenAndRole } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    ShoppingCart,
    Tags,
    Heart,
    User,
    Phone,
    Info,
    Store,
    PackageSearch,
} from "lucide-react";


// ⛳ Updated: Added event listener to detect token/role changes dynamically
export function NavbarComp() {
    const router = useRouter();

    const [session, setSession] = useState<{ token: string | null; is_admin: boolean }>({
        token: null,
        is_admin: false,
    });

    const linkStyle =
        "flex items-center gap-2 px-3 hover:border-b hover:border-b-neutral-500 hover:border-b-2 hover:py-1 hover:text-neutral-950 transition-all duration-200";


    const publicLinks = [
        { href: pageLinks.home, label: "Home", icon: <Home size={18} /> },
        { href: "#", label: "Categories", icon: <Tags size={18} /> },
        { href: "#", label: "About Us", icon: <Info size={18} /> },
    ];

    const userLinks = [{ href: pageLinks.search, label: "Search", icon: <Search size={18} /> }];

    // ✅ Updated logic: Pull session from localStorage on mount and when storage changes
    const loadSession = () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        setSession({
            token,
            is_admin: role === "admin",
        });
    };

    useEffect(() => {
        loadSession();

        // 🔁 Listen to localStorage changes across tabs/windows
        const handleStorageChange = () => {
            loadSession();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        removeTokenAndRole();
        setSession({ token: null, is_admin: false }); // ensure local state updates
        router.push(pageLinks.login);
    };

    const navigationLinks = () => (
        <div className="flex flex-col lg:flex-row items-center md:space-x-2 space-y-5 lg:space-y-0">
            {publicLinks.map((link, index) => (
                <Link key={`${link.href}-${index}`} className={linkStyle} href={link.href}>
                    {link.icon}
                    {link.label}
                </Link>
            ))}
            {session.token &&
                userLinks.map((link) => (
                    <Link key={link.href} className={linkStyle} href={link.href}>
                        {link.icon}
                        {link.label}
                    </Link>
                ))}
        </div>
    );

    return (
        <nav className="flex items-center justify-between bg-background backdrop-blur-lg w-full border-b border-b-border z-50 h-16 overflow-hidden fixed px-5">
            <div className="flex items-center space-x-4">
                <Link href={pageLinks.home} passHref className="flex items-center space-x-2">
                    <Image src={assetsLinks.logo.src} width={100} height={100} alt={assetsLinks.logo.alt} />
                </Link>

                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem className="group space-x-5 text-sm text-neutral-950">
                            {navigationLinks()}
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <NavigationMenu className="right-0">
                <NavigationMenuList>
                    <NavigationMenuItem className="group space-x-5 flex-row">
                        <Drawer>
                            <div className="flex-row flex items-center space-x-2">
                                <SearchBarComp />
                                {session.token ? (
                                    <Button onClick={handleLogout} variant={"destructive"}>
                                        Logout
                                    </Button>
                                ) : (
                                    <>
                                        <Link href={pageLinks.login} passHref>
                                            <Button>Login</Button>
                                        </Link>
                                        <Link href={pageLinks.sign_up} passHref>
                                            <Button className="hover:bg-lime-50 hover:text-lime-950" variant={"outline"}>
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                <DrawerTrigger className="flex lg:hidden">
                                    <LucideMenu />
                                </DrawerTrigger>
                            </div>
                            <DrawerContent className="border-t">
                                <div className="mx-auto md:w-5/6 w-full overflow-y-scroll no-scrollbar">
                                    <DrawerHeader className="space-y-1">
                                        <DrawerTitle></DrawerTitle>
                                        {navigationLinks()}
                                    </DrawerHeader>
                                    <DrawerFooter>
                                        <DrawerClose></DrawerClose>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    );
}
