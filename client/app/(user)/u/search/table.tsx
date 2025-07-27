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

export const TableComponent = ({ data = [], loading, error }: TableComponentProps) => {
    const handleUpdate = (id: string) => {
        console.log("Updating item:", id);
        // Add your update logic here
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            console.log("Deleting item:", id);
            // Add your delete logic here
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
                {data.map((item,index) => (
                    <TableRow key={item.id ?? `${item.name}-${index}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category?.name || "N/A"}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right font-mono">₹ {item.price}</TableCell>
                        <TableCell className="text-center">
                            <Button
                                variant="secondary"
                                className="text-blue-700 hover:bg-blue-100 hover:border hover:border-blue-300"
                                onClick={() => handleUpdate(item.id)}
                            >
                                Update
                            </Button>
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
