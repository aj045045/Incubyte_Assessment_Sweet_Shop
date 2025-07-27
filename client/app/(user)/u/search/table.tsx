"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UpdateSweetDialog } from "./update-sweet";
import { FormHandler } from "@/lib/form-handler";
import { PurchaseDialog } from "./purchase";
import { RestockDialog } from "./restock";
import { useEffect, useState } from "react";
import { getTokenAndRole } from "@/lib/utils";

type Item = {
    id: string;
    name: string;
    category: { name: string };
    quantity: number;
    price: number;
};

type TableComponentProps = {
    data?: Item[];
    loading: boolean;
    error: any;
};

/**
 * The `TableComponent` function renders a table with data, allowing users to update and delete items
 * with confirmation.
 * @param {TableComponentProps}  - - `data`: An array of items to be displayed in the table.
 * @returns The `TableComponent` function is returning a table component that displays data in a
 * tabular format. The table consists of headers for columns such as Name, Category, Quantity, Price,
 * Update, and Delete. For each item in the `data` array, a row is generated with corresponding values
 * for each column. The user can also delete items by clicking the "Delete" button, which triggers a
 */
export const TableComponent = ({ data = [], loading, error }: TableComponentProps) => {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const { token, role } = getTokenAndRole();

        if (token && role === 'admin') {
            setIsAdmin(true);
        }
    }, []);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            FormHandler.onSubmitDelete(`/api/sweets/${id}`);
            window.location.reload();
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error loading data</div>;
    if (data.length === 0) return <div className="p-6 text-center text-gray-400">No data found.</div>;

    return (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <Table className="min-w-full text-sm">
                <TableHeader>
                    <TableRow className="bg-accent-foreground/20">
                        <TableHead className="text-left px-4 py-3">Name</TableHead>
                        <TableHead className="text-left px-4 py-3">Category</TableHead>
                        <TableHead className="text-left px-4 py-3">Quantity</TableHead>
                        <TableHead className="text-right px-4 py-3">Price (₹)</TableHead>
                        {!isAdmin && (
                            <>
                                <TableHead className="text-center px-4 py-3">Purchase</TableHead>
                            </>)}
                        {isAdmin && (
                            <>
                                <TableHead className="text-center px-4 py-3">Restock</TableHead>
                                <TableHead className="text-center px-4 py-3">Update</TableHead>
                                <TableHead className="text-center px-4 py-3">Delete</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={item.id ?? `${item.name}-${index}`} className="hover:bg-white transition">
                            <TableCell className="px-4 py-2 font-medium text-gray-800">{item.name}</TableCell>
                            <TableCell className="px-4 py-2 text-gray-700">{item.category?.name || "N/A"}</TableCell>
                            <TableCell className="px-4 py-2">{item.quantity}</TableCell>
                            <TableCell className="px-4 py-2 text-right font-mono">₹ {item.price}</TableCell>

                            {!isAdmin && (
                                <>
                                    {/* Purchase Button */}
                                    <TableCell className="px-4 py-2 text-center">
                                        <PurchaseDialog maxQuantity={item.quantity} sweetId={item.id} />
                                    </TableCell>
                                </>)}

                            {isAdmin && (
                                <>
                                    {/* Restock Button */}
                                    <TableCell className="px-4 py-2 text-center">
                                        <RestockDialog sweetId={item.id} />
                                    </TableCell>

                                    {/* Update Dialog */}
                                    <TableCell className="px-4 py-2 text-center">
                                        <UpdateSweetDialog
                                            id={item.id}
                                            name={item.name}
                                            price={item.price}
                                            quantity={item.quantity}
                                            key={index}
                                        />
                                    </TableCell>

                                    {/* Delete Button */}
                                    <TableCell className="px-4 py-2 text-center">
                                        <Button
                                            variant="destructive"
                                            className="hover:bg-red-600 hover:text-white"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
