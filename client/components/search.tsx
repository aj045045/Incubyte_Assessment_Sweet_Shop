"use client"
import { Home, LucideSearch, Search, User } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useEffect, useState } from "react"
import Link from "next/link";
import { pageLinks } from "@/constant/page-links";

/* The `SearchBarComp` function is a React component that represents a search bar in a navigation
component. Here's a breakdown of what it does: */
export function SearchBarComp() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const publicLinks = [
        { href: pageLinks.home, label: "Home", icon: <Home size={18} /> },
        { href: pageLinks.search, label: "Search", icon: <Search size={18} /> },
    ];

    const userLinks = [
        { href: pageLinks.user.profile, label: "Profile", icon: <User size={18} /> },
    ];

    return (
        <>
            <div className="flex items-center justify-between w-20 px-2 py-1 space-x-2 text-sm border rounded-full bg-muted-foreground/5 border-border/50 md:px-4 md:py-1.5 md:rounded-sm md:w-52" onClick={() => setOpen((open) => !open)}>
                <div className="flex items-center text-neutral-950 space-x-2">
                    <LucideSearch size={15} />
                    <div className="md:hidden">Ctrl&nbsp;K</div>
                    <div className="hidden md:block">Quick Search...</div>
                </div>
                <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Suggestions">
                        {publicLinks.map((link, idx) => (
                            <CommandItem key={idx} asChild>
                                <Link href={link.href} className="flex items-center gap-2">
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />
                </CommandList>
            </CommandDialog>
        </>
    );
}
