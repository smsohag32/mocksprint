import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageUrl } from '@/lib/image-utils';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { 
  Search, 
  MoreHorizontal, 
  UserPen, 
  Trash2, 
  UserCheck, 
  UserX,
  UserSearch,
  ChevronLeft,
  ChevronRight,
  Shield,
  Mail,
  Calendar
} from 'lucide-react';
import { 
  useGetUsersPagedQuery, 
  useDeleteUserMutation, 
  useToggleUserStatusMutation,
  useUpdateUserMutation 
} from "@/api/endpoints/user.api";
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function ManageUsersPage() {
  const navigate = useNavigate();
  // State for pagination and filtering
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const debouncedSearch = useDebounce(search, 500);

  // Fetch users with RTK Query
  const { data, isLoading, isFetching } = useGetUsersPagedQuery({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter === 'all' ? undefined : statusFilter,
    role: roleFilter === 'all' ? undefined : roleFilter
  });

  // Mutations
  const [deleteUser] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();
  const [updateUser] = useUpdateUserMutation();

  // Edit Modal State
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user' });

  const handleEditOpen = (user: any) => {
    setEditUser(user);
    setEditForm({ name: user.name || '', email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    try {
      await updateUser({ id: editUser.id, ...editForm }).unwrap();
      toast.success('User updated successfully');
      setEditUser(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update user');
    }
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'inactive' ? 'active' : 'inactive';
    try {
      await toggleStatus({ id: user.id, status: newStatus }).unwrap();
      toast.success(`User marked as ${newStatus}`);
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted');
    } catch (err: any) {
      toast.error('Failed to delete user');
    }
  };

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">Administer user accounts, permissions, and status across the platform.</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10 h-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to page 1 on search
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1); // Reset to page 1 on filter
              }}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(v) => {
                setRoleFilter(v);
                setPage(1); // Reset to page 1 on filter
              }}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/20 border-b border-border/50">
                  <TableHead className="w-[300px] font-semibold py-4">User Details</TableHead>
                  <TableHead className="font-semibold py-4">Role</TableHead>
                  <TableHead className="font-semibold py-4">Status</TableHead>
                  <TableHead className="font-semibold py-4 text-nowrap">Joined Date</TableHead>
                  <TableHead className="text-right font-semibold py-4 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isFetching ? (
                  Array.from({ length: limit }).map((_, i) => (
                    <TableRow key={i} className="border-b border-border/40">
                      <TableCell className="py-4"><Skeleton className="h-12 w-full" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="py-4 text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.users && data.users.length > 0 ? (
                  data.users.map((u: any) => (
                    <TableRow key={u.id} className="group transition-colors border-b border-border/40 hover:bg-muted/10">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-background shadow-sm ring-1 ring-border/50">
                            <AvatarImage src={getImageUrl(u.profile_image)} className="object-cover" />
                            <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-bold">
                              {(u.name || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm leading-none mb-1">{u.name || 'Unnamed'}</span>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3.5 w-3.5" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn(
                          "capitalize gap-1.5 font-medium px-2 py-0.5 border-transparent bg-secondary/50",
                          u.role === 'admin' && "bg-primary/10 text-primary border-primary/20"
                        )}>
                          <Shield className="h-3.5 w-3.5" />
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant={u.status === 'active' ? 'default' : 'secondary'} className={cn(
                          "capitalize px-2.5 py-0.5 rounded-full font-semibold text-[10px]",
                          u.status === 'active' ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm" : "bg-slate-400 dark:bg-slate-700"
                        )}>
                          {u.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full transition-all group-hover:bg-background group-hover:shadow-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 p-2 shadow-xl border-border/50">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">User Control</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/administrator/users/${u.id}`)} className="rounded-md focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                              <UserSearch className="mr-3 h-4 w-4" /> View Full Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOpen(u)} className="rounded-md focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                              <UserPen className="mr-3 h-4 w-4" /> Edit User Data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(u)} className="rounded-md focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                              {u.status === 'inactive' ? (
                                <><UserCheck className="mr-3 h-4 w-4 text-emerald-500" /> Activate Account</>
                              ) : (
                                <><UserX className="mr-3 h-4 w-4 text-orange-500" /> Deactivate Account</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-border/50" />
                            <DropdownMenuItem 
                              className="rounded-md text-destructive focus:bg-destructive focus:text-white transition-colors cursor-pointer"
                              onClick={() => handleDelete(u.id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4" /> Permanently Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-8 w-8 opacity-20" />
                        <p>No users found matching your search criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/10 gap-4">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{(page - 1) * limit + 1}</span> to <span className="text-foreground font-bold">{Math.min(page * limit, data?.total || 0)}</span> of <span className="text-foreground font-bold">{data?.total}</span> total users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 shadow-sm transition-all hover:bg-background"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  // Show current page, first, last, and pages around current
                  if (pNum === 1 || pNum === totalPages || (pNum >= page - 1 && pNum <= page + 1)) {
                    return (
                      <Button
                        key={i}
                        variant={page === pNum ? 'default' : 'outline'}
                        size="icon"
                        className={cn(
                          "h-8 w-8 text-xs font-bold transition-all shadow-sm",
                          page === pNum ? "gradient-primary border-transparent" : "hover:bg-background"
                        )}
                        onClick={() => setPage(pNum)}
                      >
                        {pNum}
                      </Button>
                    );
                  }
                  if (pNum === page - 2 || pNum === page + 2) {
                    return <span key={i} className="text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shadow-sm transition-all hover:bg-background"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/50 shadow-2xl">
          <DialogHeader className="p-6 bg-muted/30 border-b border-border/50">
            <DialogTitle className="text-xl font-bold">Edit User Profile</DialogTitle>
            <DialogDescription className="text-xs">
              Modify account details and platform permissions. Changes will take effect immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 p-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                className="h-10 border-border/60 focus:ring-primary/20"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="h-10 pl-10 border-border/60 focus:ring-primary/20"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Role</Label>
              <Select 
                value={editForm.role} 
                onValueChange={(v) => setEditForm({ ...editForm, role: v })}
              >
                <SelectTrigger className="h-10 border-border/60 focus:ring-primary/20">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="border-border/50">
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/20 border-t border-border/50 flex flex-row items-center justify-end gap-3">
            <Button variant="ghost" className="h-10 px-6 font-medium" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleUpdate} className="h-10 px-8 gradient-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
