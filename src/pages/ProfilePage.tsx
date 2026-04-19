import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/api/userApi';
import { useGetSubmissionsQuery } from '@/services/api/interviewApi';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: profile, isLoading } = useGetProfileQuery();
  const { data: submissions } = useGetSubmissionsQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [name, setName] = useState('');

  const handleUpdate = async () => {
    if (!name.trim()) return;
    try {
      await updateProfile({ name }).unwrap();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <h1 className="text-2xl font-bold">Profile</h1>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="gradient-primary text-primary-foreground text-xl">
                  {(profile?.name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{profile?.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <Badge variant="outline" className="mt-1">{user?.role}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={profile?.name || 'Your name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Button onClick={handleUpdate} disabled={updating} className="gradient-primary text-primary-foreground">
                    {updating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions?.length ? (
              <div className="space-y-3">
                {submissions.slice(0, 10).map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <div>
                      <p className="font-medium text-sm">{s.questions?.title || 'Question'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={s.score >= 80 ? 'default' : 'secondary'}>{s.score}%</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
