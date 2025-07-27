import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormHandler } from "@/lib/form-handler";
import { useZodForm } from "@/lib/use-zod-form";
import * as z from "zod";

interface RestockDialogProps {
    sweetId: string;
}

const restockSchema = z.object({
    quantity: z
        .number()
        .int("Quantity must be an integer")
        .min(1, "You must add at least 1 item"),
});

type RestockFormData = z.infer<typeof restockSchema>;

export function RestockDialog({ sweetId }: RestockDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useZodForm(restockSchema, {
        defaultValues: { quantity: 1 },
    });

    const onSubmit = async (data: RestockFormData) => {
        await FormHandler.onSubmitPost(`/api/sweets/${sweetId}/restock`, data);
        reset();
        window.location.reload(); // optional: can be replaced with a toast or refetch
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                    Restock
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Restock Sweet</DialogTitle>
                    <DialogDescription>
                        Enter how many items you want to add to stock.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Restock Quantity
                        </label>
                        <Input
                            id="quantity"
                            type="number"
                            {...register("quantity", {
                                valueAsNumber: true,
                            })}
                            placeholder="e.g. 10"
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit">Add Stock</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
