import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormHandler } from "@/lib/form-handler";
import { useZodForm } from "@/lib/use-zod-form";
import * as z from "zod";

export function CategoryDialog() {
    const categorySchema = z.object({
        name: z.string().min(3, 'Category name is required'),
    });

    type CategoryFormData = z.infer<typeof categorySchema>;
    const { register, handleSubmit, formState: { errors }, reset } = useZodForm(categorySchema, { defaultValues: { name: "" } });

    const onSubmit = (data: CategoryFormData) => {
        FormHandler.onSubmitPost("/api/sweets/categories", data);
        reset();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Please enter the name of the category you want to create.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Category Name
                        </label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Category name is required' })}
                            placeholder="e.g. Kafju"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}