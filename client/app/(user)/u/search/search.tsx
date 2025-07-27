"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySearch } from "./category-search";
import { CategoryDialog } from "./category-dialog";
import { SweetDialog } from "./sweet-dialog";

export function SearchComponent({
    filters,
    onFilterChange,
}: {
    filters: {
        name: string;
        category: string;
        minPrice: string;
        maxPrice: string;
    };
    onFilterChange: (key: string, value: string) => void;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8 items-end">
            {/* Name Search */}
            <div className="flex flex-col space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="Search by name"
                    value={filters.name}
                    onChange={(e) => onFilterChange("name", e.target.value)}
                />
            </div>

            {/* Category Search */}
            <div className="flex flex-col space-y-1">
                <Label htmlFor="category">Category</Label>
                <CategorySearch
                    value={filters.category}
                    setValue={onFilterChange}
                />

            </div>

            {/* Min Price */}
            <div className="flex flex-col space-y-1">
                <Label htmlFor="minPrice">Min ₹</Label>
                <Input
                    id="minPrice"
                    min={0}
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => onFilterChange("minPrice", e.target.value)}
                />
            </div>

            {/* Max Price */}
            <div className="flex flex-col space-y-1">
                <Label htmlFor="maxPrice">Max ₹</Label>
                <Input
                    id="maxPrice"
                    min={0}
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                />
            </div>

            {/* Add Category */}
            <CategoryDialog />
            {/* Add Sweets */}
            <SweetDialog />
        </div>
    );
}

