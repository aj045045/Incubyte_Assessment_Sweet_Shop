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

interface PurchaseDialogProps {
    sweetId: string;
    maxQuantity: number; // for validation (optional but useful)
}

const purchaseSchema = z.object({
    quantity: z
        .number()
        .int("Quantity must be an integer")
        .min(1, "You must purchase at least 1 item"),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export function PurchaseDialog({ sweetId, maxQuantity }: PurchaseDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useZodForm(purchaseSchema, {
        defaultValues: { quantity: 1 },
    });

    const onSubmit = async (data: PurchaseFormData) => {
        await FormHandler.onSubmitPost(`/api/sweets/${sweetId}/purchase`, data);
        reset();
        window.location.reload();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                >
                    Purchase
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Purchase Sweet</DialogTitle>
                    <DialogDescription>
                        Enter the quantity you want to purchase.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Quantity
                        </label>
                        <Input
                            id="quantity"
                            type="number"
                            {...register("quantity", {
                                valueAsNumber: true,
                                max: {
                                    value: maxQuantity,
                                    message: `Only ${maxQuantity} in stock`,
                                },
                            })}
                            placeholder="e.g. 3"
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit">Buy</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
