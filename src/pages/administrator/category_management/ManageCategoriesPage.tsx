import { useState } from "react";
import {
   useGetCategoriesQuery,
   useCreateCategoryMutation,
   useUpdateCategoryMutation,
   useDeleteCategoryMutation,
   QuestionCategory,
} from "@/api/endpoints/questionCategory.api";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
   Plus,
   Search,
   Edit2,
   Trash2,
   MoreVertical,
   CheckCircle2,
   XCircle,
   Loader2,
   AlertCircle,
} from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ManageCategoriesPage() {
   const [searchTerm, setSearchTerm] = useState("");
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);

   // Form states
   const [formData, setFormData] = useState({ name: "", description: "", is_active: true });

   const { data, isLoading, isError } = useGetCategoriesQuery({ search: searchTerm });
   const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
   const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
   const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

   const handleAddSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await createCategory(formData).unwrap();
         toast.success("Category created successfully");
         setIsAddModalOpen(false);
         setFormData({ name: "", description: "", is_active: true });
      } catch (err: any) {
         toast.error(err.data?.message || "Failed to create category");
      }
   };

   const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedCategory) return;
      try {
         await updateCategory({ id: selectedCategory.id, ...formData }).unwrap();
         toast.success("Category updated successfully");
         setIsEditModalOpen(false);
      } catch (err: any) {
         toast.error(err.data?.message || "Failed to update category");
      }
   };

   const handleDeleteConfirm = async () => {
      if (!selectedCategory) return;
      try {
         await deleteCategory(selectedCategory.id).unwrap();
         toast.success("Category deleted successfully");
         setIsDeleteDialogOpen(false);
      } catch (err: any) {
         toast.error(err.data?.message || "Failed to delete category");
      }
   };

   const openEditModal = (category: QuestionCategory) => {
      setSelectedCategory(category);
      setFormData({
         name: category.name,
         description: category.description || "",
         is_active: category.is_active,
      });
      setIsEditModalOpen(true);
   };

   const openDeleteDialog = (category: QuestionCategory) => {
      setSelectedCategory(category);
      setIsDeleteDialogOpen(true);
   };

   const categories = data?.categories || [];

   return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-black tracking-tight">Question Categories</h1>
            </div>
            <Dialog
               open={isAddModalOpen}
               onOpenChange={setIsAddModalOpen}>
               <DialogTrigger asChild>
                  <Button className="gradient-primary text-white font-bold shadow-lg hover:shadow-primary/20 transition-all">
                     <Plus className="h-4 w-4 mr-2" /> Add Category
                  </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                     <DialogTitle className="text-2xl font-black">Add New Category</DialogTitle>
                     <DialogDescription>
                        Create a new domain for grouping questions.
                     </DialogDescription>
                  </DialogHeader>
                  <form
                     onSubmit={handleAddSubmit}
                     className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label
                           htmlFor="name"
                           className="font-bold">
                           Category Name
                        </Label>
                        <Input
                           id="name"
                           placeholder="e.g. Frontend Development"
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label
                           htmlFor="description"
                           className="font-bold">
                           Description
                        </Label>
                        <Textarea
                           id="description"
                           placeholder="Provide a brief overview of this category..."
                           value={formData.description}
                           onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                           }
                           rows={4}
                        />
                     </div>
                     <DialogFooter>
                        <Button
                           type="button"
                           variant="ghost"
                           onClick={() => setIsAddModalOpen(false)}>
                           Cancel
                        </Button>
                        <Button
                           type="submit"
                           disabled={isCreating}
                           className="gradient-primary">
                           {isCreating ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                           ) : (
                              <Plus className="h-4 w-4 mr-2" />
                           )}
                           Create Category
                        </Button>
                     </DialogFooter>
                  </form>
               </DialogContent>
            </Dialog>
         </div>

         <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
               <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Search categories..."
                        className="pl-10 bg-background/50 border-border/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader className="bg-muted/20">
                     <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold">Name</TableHead>
                        <TableHead className="font-bold">Description</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                        <TableRow>
                           <TableCell
                              colSpan={4}
                              className="h-64 text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                              <p className="text-sm text-muted-foreground mt-2">
                                 Loading categories...
                              </p>
                           </TableCell>
                        </TableRow>
                     ) : categories.length === 0 ? (
                        <TableRow>
                           <TableCell
                              colSpan={4}
                              className="h-64 text-center">
                              <div className="flex flex-col items-center gap-2">
                                 <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                 <p className="text-muted-foreground font-medium">
                                    No categories found.
                                 </p>
                                 <Button
                                    variant="link"
                                    onClick={() => setSearchTerm("")}>
                                    Clear search
                                 </Button>
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        categories.map((category) => (
                           <TableRow
                              key={category.id}
                              className="hover:bg-muted/10 transition-colors group">
                              <TableCell className="font-bold py-4">{category.name}</TableCell>
                              <TableCell className="text-muted-foreground max-w-md truncate">
                                 {category.description || "No description provided."}
                              </TableCell>
                              <TableCell>
                                 <Badge
                                    className={
                                       category.is_active
                                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                          : "bg-slate-500/10 text-slate-500"
                                    }>
                                    {category.is_active ? (
                                       <>
                                          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                                       </>
                                    ) : (
                                       <>
                                          <XCircle className="h-3 w-3 mr-1" /> Inactive
                                       </>
                                    )}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 rounded-full">
                                          <MoreVertical className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                       align="end"
                                       className="w-40 shadow-xl border-border/50">
                                       <DropdownMenuItem
                                          onClick={() => openEditModal(category)}
                                          className="cursor-pointer">
                                          <Edit2 className="h-4 w-4 mr-2 text-primary" /> Edit
                                       </DropdownMenuItem>
                                       <DropdownMenuItem
                                          onClick={() => openDeleteDialog(category)}
                                          className="cursor-pointer text-destructive focus:text-destructive">
                                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         {/* Edit Modal */}
         <Dialog
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Edit Category</DialogTitle>
                  <DialogDescription>Modify the details of this category.</DialogDescription>
               </DialogHeader>
               <form
                  onSubmit={handleEditSubmit}
                  className="space-y-4 py-4">
                  <div className="space-y-2">
                     <Label
                        htmlFor="edit-name"
                        className="font-bold">
                        Category Name
                     </Label>
                     <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label
                        htmlFor="edit-description"
                        className="font-bold">
                        Description
                     </Label>
                     <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <input
                        type="checkbox"
                        id="edit-active"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                     />
                     <Label
                        htmlFor="edit-active"
                        className="text-sm font-medium leading-none cursor-pointer">
                        Active status
                     </Label>
                  </div>
                  <DialogFooter>
                     <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditModalOpen(false)}>
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        disabled={isUpdating}
                        className="gradient-primary">
                        {isUpdating ? (
                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                           <CheckCircle2 className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         {/* Delete Alert Dialog */}
         <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">
                     Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete the
                     <span className="font-bold text-foreground"> {selectedCategory?.name} </span>
                     category.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleDeleteConfirm}
                     className="bg-destructive hover:bg-destructive/90 font-bold"
                     disabled={isDeleting}>
                     {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                     ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                     )}
                     Yes, Delete Category
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}
