"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // ShadCN Button

type TableComponentProps = {
    data?: any[];
    loading: boolean;
    error: any;
};

export const TableComponent = ({ data, loading, error }: TableComponentProps) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;
    const handleUpdate = (id: string) => {
        console.log("Updating item:", id);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            console.log("Deleting item:", id);
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-left">Name</TableHead>
                    <TableHead className="text-left">Category</TableHead>
                    <TableHead className="w-[100px] text-left">Quantity</TableHead>
                    <TableHead className="text-right w-[120px]">₹ Price</TableHead>
                    <TableHead className="w-[100px] text-center">Update</TableHead>
                    <TableHead className="w-[100px] text-center">Delete</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((item) => (
                    <TableRow>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category.name}</TableCell>
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
}
