import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2 } from 'lucide-react';
import { useGetAllUsersQuery, useDeleteUserMutation } from '@/services/api/userApi';
import { toast } from 'sonner';

export default function ManageUsersPage() {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Manage Users</h1>

        <Card className="border-border/50">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : users?.length ? (
              <div className="divide-y divide-border">
                {users.map((u: any) => (
                  <div key={u.id} className="flex items-center gap-4 p-4">
                    <Avatar>
                      <AvatarFallback>{(u.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{u.name || 'Unnamed'}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No users found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
