import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CategoryDialog } from "../components/category/CategoryDialog";
import { CategoryList } from "../components/category/CategoryList";
import { DeleteCategoryDialog } from "../components/category/DeleteCategoryDialog";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { type Category, categoryService } from "../services/category.service";

export function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Delete states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Erro ao carregar categorias");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        try {
            await categoryService.delete(categoryToDelete.id);
            toast.success("Categoria removida!");
            await fetchCategories();
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error("Failed to delete category", error);
            toast.error("Erro ao remover categoria");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Gestão de Categorias"
                description="Organize suas finanças categorizando suas transações."
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Nova Categoria
                    </Button>
                }
            />

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <CategoryList
                    categories={categories}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                        const cat = categories.find((c) => c.id === id);
                        if (cat) handleDeleteClick(cat);
                    }}
                />
            )}

            <CategoryDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchCategories}
                categoryToEdit={editingCategory}
            />

            <DeleteCategoryDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                categoryName={categoryToDelete?.name || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}
