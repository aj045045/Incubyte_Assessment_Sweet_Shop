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

// Type Definitions
type Item = {
    id: string;
    name: string;
    category: {
        name: string;
    };
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
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            FormHandler.onSubmitDelete(`/api/sweets/${id}`);
            window.location.reload();
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading data</div>;
    if (data.length === 0) return <div className="p-4">No data found.</div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-left">Name</TableHead>
                    <TableHead className="text-left">Category</TableHead>
                    <TableHead className="w-[100px] text-left">Quantity</TableHead>
                    <TableHead className="w-[120px] text-right">₹ Price</TableHead>
                    <TableHead className="w-[100px] text-center">Update</TableHead>
                    <TableHead className="w-[100px] text-center">Delete</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={item.id ?? `${item.name}-${index}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category?.name || "N/A"}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right font-mono">₹ {item.price}</TableCell>
                        <TableCell className="text-center">
                            <UpdateSweetDialog id={item.id} name={item.name} price={item.price} quantity={item.quantity} key={index} />
                        </TableCell>
                        <TableCell className="text-center">
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
