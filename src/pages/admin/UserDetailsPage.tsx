import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery, useToggleUserStatusMutation, useDeleteUserMutation } from '@/api/endpoints/user.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Github, 
  Linkedin, 
  Globe, 
  UserCheck, 
  UserX, 
  Trash2,
  ExternalLink,
  History,
  CheckCircle2,
  Trophy,
  Loader2
} from 'lucide-react';
import { getImageUrl } from '@/lib/image-utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserByIdQuery(id as string);
  const [toggleStatus, { isLoading: toggling }] = useToggleUserStatusMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const handleToggleStatus = async () => {
    if (!user) return;
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await toggleStatus({ id: user.id, status: newStatus }).unwrap();
      toast.success(`User successfully ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to PERMANENTLY delete this user? This cannot be undone.')) return;
    try {
      await deleteUser(user.id).unwrap();
      toast.success('User deleted successfully');
      navigate('/admin/users');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (isLoading) return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto py-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-[500px] lg:col-span-2" />
        <Skeleton className="h-[300px]" />
      </div>
    </div>
  );

  if (error || !user) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <p className="text-muted-foreground">User not found or an error occurred.</p>
      <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
    </div>
  );

  const profile = user.profile || {};

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/users')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground text-sm">Review and manage {user.name}'s account.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-10 px-4 font-bold border-border/60"
            onClick={handleToggleStatus}
            disabled={toggling}
          >
            {toggling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (
              user.status === 'active' ? <UserX className="h-4 w-4 mr-2 text-orange-500" /> : <UserCheck className="h-4 w-4 mr-2 text-emerald-500" />
            )}
            {user.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button 
            variant="destructive" 
            className="h-10 px-4 font-bold"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-1 ring-border/50">
                  <AvatarImage src={getImageUrl(profile.profile_image)} className="object-cover" />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-4xl font-bold">
                    {(user.name || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                      <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
                      <Badge className={cn(
                        "text-[10px] uppercase font-black px-2 py-0.5",
                        user.status === 'active' ? "bg-emerald-500" : "bg-slate-500"
                      )}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                      <Mail className="h-4 w-4" /> {user.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary py-1 px-3">
                      <Shield className="h-3 w-3 mr-1.5" />
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className="py-1 px-3">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Phone Number</p>
                          <p className="text-sm font-semibold">{profile.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Location</p>
                          <p className="text-sm font-semibold">{profile.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Professional Presence</h3>
                    <div className="space-y-3">
                      {profile.github_url && (
                        <a href={profile.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <Github className="h-4 w-4" />
                            <span className="text-sm font-semibold">GitHub Profile</span>
                          </div>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {profile.linkedin_url && (
                        <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <Linkedin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-semibold">LinkedIn Profile</span>
                          </div>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {profile.portfolio_url && (
                        <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-semibold">Portfolio Website</span>
                          </div>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {!profile.github_url && !profile.linkedin_url && !profile.portfolio_url && (
                        <p className="text-xs text-muted-foreground italic">No professional links provided.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">About & Bio</h3>
                    <div className="p-4 rounded-xl bg-muted/20 border border-border/30 min-h-[100px]">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {profile.bio || "No biography provided by the user yet."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills ? profile.skills.split(',').map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 bg-background border border-border/50 text-[11px] font-bold">
                          {skill.trim()}
                        </Badge>
                      )) : (
                        <p className="text-xs text-muted-foreground italic">No skills listed.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-8">
          <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b border-border/40 mb-4">
              <CardTitle className="text-lg">Interview Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
               <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-background shadow-sm border border-border/20 text-blue-500">
                      <History className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">Attempts</span>
                  </div>
                  <span className="text-xl font-black tabular-nums">0</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-background shadow-sm border border-border/20 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">Success</span>
                  </div>
                  <span className="text-xl font-black tabular-nums">0%</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-background shadow-sm border border-border/20 text-amber-500">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">Avg Score</span>
                  </div>
                  <span className="text-xl font-black tabular-nums">0%</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
