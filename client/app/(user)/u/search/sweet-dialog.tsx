import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormHandler } from "@/lib/form-handler";
import { useZodForm } from "@/lib/use-zod-form";
import * as z from "zod";
import { CategorySearch } from "./category-search";


export function SweetDialog() {
    const sweetSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        price: z.number().min(0, 'Price must be a positive number'),
        category: z.string().min(1, 'Category is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    });

    type SweetFormData = z.infer<typeof sweetSchema>;

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useZodForm(sweetSchema, {
        defaultValues: {
            name: '',
            price: 0,
            category: '',
            quantity: 1,
        },
    });

    const onSubmit = (data: SweetFormData) => {
        FormHandler.onSubmitPost("/api/sweets", data);
        reset();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Sweet</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Sweet</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new sweet to your inventory.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Sweet Name
                        </label>
                        <Input id="name" {...register('name')} placeholder="e.g. Chocolate Fudge" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price ($)
                        </label>
                        <Input
                            min={0}
                            id="price"
                            type="number"
                            step="10"
                            {...register('price', {
                                valueAsNumber: true,
                            })}
                            placeholder="e.g. 5.99"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <CategorySearch
                            value={watch("category")} // watch from react-hook-form
                            setValue={(key, val) => setValue(key as keyof SweetFormData, val)}
                        />
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Quantity
                        </label>
                        <Input
                            id="quantity"
                            min={0}
                            type="number"
                            {...register('quantity', {
                                valueAsNumber: true,
                            })}
                            placeholder="e.g. 100"
                        />
                        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
