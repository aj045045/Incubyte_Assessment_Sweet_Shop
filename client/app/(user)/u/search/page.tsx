'use client';

import { useState, useMemo } from "react";
import useSWR from "swr";
import { SearchComponent } from "./search";
import { TableComponent } from "./table";
import { getTokenAndRole } from "@/lib/utils";

interface SweetData {
    id: string;
    name: string;
    category: {
        id: string;
        name: string;
    };
    price: number;
    quantity: number;
}

interface ApiResponse {
    status: "success" | "error";
    data: SweetData[];
    message: string | null;
}

const fetcher = async (url: string) => {
    const { token } = getTokenAndRole();

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

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
        setFilters((prev) => ({
            ...prev,
            [key]: value.trim(), // trim to prevent accidental space-only filters
        }));
    };


    const filterQuery = useMemo(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return params.toString();
    }, [filters]);

    const endpoint = useMemo(() => {
        const hasFilters = Object.values(filters).some(val => val.trim() !== "");
        return hasFilters ? `/api/sweets/search?${filterQuery}` : `/api/sweets`;
    }, [filters, filterQuery]);

    const { data, error, isLoading } = useSWR<ApiResponse>(endpoint, fetcher);
    return (
        <div className="m-5 rounded-md p-2 border border-neutral-300">
            {isLoading && <p>Loading sweets...</p>}
            {error && <p className="text-red-500">Error loading sweets: {error.message}</p>}
            <div className="text-sm text-gray-600 mb-2">
                <strong>Query:</strong> {filterQuery || "None"} <br />
                <strong>Data:</strong> {JSON.stringify(data && data['data'])}
            </div>

            <SearchComponent filters={filters} onFilterChange={handleFilterChange} />
            <TableComponent
                data={data?.data}
                loading={isLoading}
                error={error}
            />
        </div>
    );
}