'use client';

import { useState, useMemo } from "react";
import useSWR from "swr";
import { SearchComponent } from "./search";
import { TableComponent } from "./table";

const fetcher = async (key: string) => {
    const res = await fetch(`/api/search?${key}`);
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
};

export default function SearchPage() {
    const [filters, setFilters] = useState({
        name: "",
        category: "",
        minPrice: "",
        maxPrice: "",
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Serialize filters into a stable query string
    const filterQuery = useMemo(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value); // skip empty filters
        });
        return params.toString();
    }, [filters]);

    const { data, error, isLoading } = useSWR(
        filterQuery, // key
        () => fetcher(filterQuery), // fetcher with correct query
    );

    return (
        <div className="m-5 rounded-md p-2 border border-neutral-300">
            <div className="text-sm text-gray-600 mb-2">
                <strong>Query:</strong> {filterQuery}
            </div>
            <SearchComponent filters={filters} onFilterChange={handleFilterChange} />
            <TableComponent
                data={data}
                loading={isLoading}
                error={error}
            />
        </div>
    );
}
