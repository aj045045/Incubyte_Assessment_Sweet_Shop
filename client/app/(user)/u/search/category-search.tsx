'use client';

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FormHandler } from "@/lib/form-handler";

type ApiCategory = {
    id: string;
    name: string;
};

type ApiResponse<T> = {
    status: string;
    data: T;
    message: string | null;
};

type CategoryOption = {
    value: string;
    label: string;
};

/* This `CategorySearch` function is a React component that provides a searchable dropdown menu for
selecting categories. Here's a breakdown of what it does: */
export function CategorySearch({
    value,
    setValue,
}: {
    setValue: (key: string, value: string) => void;
    value: string;
}) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            const apiResponse = await FormHandler.onSubmitGet<ApiResponse<ApiCategory[]>>("/api/sweets/categories");

            if (apiResponse?.status === "success" && Array.isArray(apiResponse.data)) {
                const mapped = apiResponse.data.map((cat) => ({
                    value: cat.name,
                    label: cat.name,
                }));
                setCategories(mapped);
            }

            setIsLoading(false);
        };

        fetchCategories();
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-light text-neutral-500"
                >
                    {value
                        ? categories.find((cat) => cat.value === value)?.label
                        : "Select Category..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search category..." className="h-9" />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>Loading categories...</CommandEmpty>
                        ) : (
                            <>
                                <CommandEmpty>No categories found.</CommandEmpty>
                                <CommandGroup>
                                    {categories.map((cat) => (
                                        <CommandItem
                                            key={cat.value}
                                            value={cat.value}
                                            onSelect={(currentValue) => {
                                                const newValue = currentValue === value ? "" : currentValue;
                                                setValue("category", newValue);
                                                setOpen(false);
                                            }}
                                        >
                                            {cat.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === cat.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
