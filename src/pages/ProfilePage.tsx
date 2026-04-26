import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/api/endpoints/user.api";
import { useGetSubmissionsQuery } from "@/api/endpoints/interview.api";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import {
   Camera,
   Mail,
   Phone,
   MapPin,
   Shield,
   User as UserIcon,
   Loader2,
   CheckCircle2,
   Code2,
   Trophy,
   History,
   Github,
   Linkedin,
   Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
   const user = useAppSelector((s) => s.auth.user);
   const { data: profile, isLoading } = useGetProfileQuery();
   const { data: submissions } = useGetSubmissionsQuery();
   const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

   // Local state for form
   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      address: "",
      first_name: "",
      last_name: "",
      bio: "",
      skills: "",
      github_url: "",
      linkedin_url: "",
      portfolio_url: "",
   });
   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (profile) {
         setFormData({
            name: profile.name || "",
            phone: profile.phone || "",
            address: profile.address || "",
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            bio: profile.bio || "",
            skills: profile.skills || "",
            github_url: profile.github_url || "",
            linkedin_url: profile.linkedin_url || "",
            portfolio_url: profile.portfolio_url || "",
         });
      }
   }, [profile]);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setSelectedFile(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            setImagePreview(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleUpdate = async () => {
      try {
         const data = new FormData();
         data.append("name", formData.name);
         data.append("phone", formData.phone);
         data.append("address", formData.address);
         data.append("first_name", formData.first_name);
         data.append("last_name", formData.last_name);
         data.append("bio", formData.bio);
         data.append("skills", formData.skills);
         data.append("github_url", formData.github_url);
         data.append("linkedin_url", formData.linkedin_url);
         data.append("portfolio_url", formData.portfolio_url);

         if (selectedFile) {
            data.append("profile_image", selectedFile);
         }

         await updateProfile(data).unwrap();
         toast.success("Profile updated successfully!");
         setSelectedFile(null);
      } catch (err: any) {
         toast.error(err?.data?.message || "Failed to update profile");
      }
   };

   if (isLoading)
      return (
         <div className="space-y-6 max-w-4xl mx-auto py-6">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Skeleton className="h-[400px] md:col-span-2" />
               <Skeleton className="h-[400px]" />
            </div>
         </div>
      );

   const stats = [
      {
         label: "Interviews",
         value: submissions?.length || 0,
         icon: History,
         color: "text-blue-500",
      },
      {
         label: "Completed",
         value: submissions?.filter((s: any) => s.score >= 70).length || 0,
         icon: CheckCircle2,
         color: "text-emerald-500",
      },
      {
         label: "Avg. Score",
         value: submissions?.length
            ? Math.round(
                 submissions.reduce((acc: number, s: any) => acc + s.score, 0) / submissions.length,
              ) + "%"
            : "0%",
         icon: Trophy,
         color: "text-amber-500",
      },
   ];

   const profileImageUrl = profile?.profile_image
      ? profile.profile_image.startsWith("http")
         ? profile.profile_image
         : `http://localhost:3000${profile.profile_image}`
      : null;

   return (
      <div className="space-y-8 animate-fade-in  pb-10">
         <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-8">
               <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
                  <CardHeader className="bg-muted/30 border-b border-border/50">
                     <CardTitle className="text-xl">Profile Information</CardTitle>
                     <CardDescription>Update your personal details here.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                     <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
                        <div className="relative group">
                           <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-1 ring-border/50">
                              <AvatarImage
                                 src={imagePreview || profileImageUrl}
                                 className="object-cover"
                              />
                              <AvatarFallback className="gradient-primary text-primary-foreground text-3xl font-bold uppercase">
                                 {(profile?.name || "U").charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <button
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10">
                              <Camera className="h-4 w-4" />
                           </button>
                           <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                           />
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label
                                 htmlFor="first_name"
                                 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                 First Name
                              </Label>
                              <Input
                                 id="first_name"
                                 placeholder="Enter first name"
                                 className="h-10"
                                 value={formData.first_name}
                                 onChange={(e) =>
                                    setFormData({ ...formData, first_name: e.target.value })
                                 }
                              />
                           </div>
                           <div className="space-y-2">
                              <Label
                                 htmlFor="last_name"
                                 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                 Last Name
                              </Label>
                              <Input
                                 id="last_name"
                                 placeholder="Enter last name"
                                 className="h-10"
                                 value={formData.last_name}
                                 onChange={(e) =>
                                    setFormData({ ...formData, last_name: e.target.value })
                                 }
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Row 1: Display Name & Email */}
                        <div className="space-y-2">
                           <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Name</Label>
                           <div className="relative">
                              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="name" 
                                className="pl-10 h-10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                           <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input id="email" className="pl-10 h-10 bg-muted/50 cursor-not-allowed" value={profile?.email} disabled />
                           </div>
                        </div>

                        {/* Row 2: Phone & Role */}
                        <div className="space-y-2">
                           <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                           <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="phone" 
                                className="pl-10 h-10"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Role</Label>
                           <div className="flex items-center pt-1">
                              <Badge variant="outline" className="px-3 py-1 capitalize border-primary/20 bg-primary/5 text-primary font-bold">
                                 <Shield className="h-3 w-3 mr-1.5" />
                                 {user?.role}
                              </Badge>
                           </div>
                        </div>

                        {/* Full Width: Bio */}
                        <div className="space-y-2 md:col-span-2 pt-2">
                           <div className="flex items-center gap-2 mb-1">
                              <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Bio</Label>
                              <div className="h-px flex-1 bg-border/40" />
                           </div>
                           <Textarea 
                             id="bio" 
                             className="min-h-[100px] border-border/60 focus:ring-primary/20 bg-muted/10"
                             placeholder="Tell us about your professional background..."
                             value={formData.bio}
                             onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                           />
                        </div>

                        {/* Full Width: Skills */}
                        <div className="space-y-2 md:col-span-2">
                           <Label htmlFor="skills" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technical Skills</Label>
                           <Input 
                             id="skills" 
                             className="h-10 bg-muted/10"
                             placeholder="React, Node.js, Python, etc. (comma separated)"
                             value={formData.skills}
                             onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                           />
                        </div>

                        {/* Social Links Section */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                           <div className="space-y-2">
                              <Label htmlFor="github" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub</Label>
                              <div className="relative">
                                 <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                 <Input 
                                   id="github" 
                                   className="pl-10 h-10 text-xs"
                                   placeholder="github.com/user"
                                   value={formData.github_url}
                                   onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="linkedin" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">LinkedIn</Label>
                              <div className="relative">
                                 <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                 <Input 
                                   id="linkedin" 
                                   className="pl-10 h-10 text-xs"
                                   placeholder="linkedin.com/in/user"
                                   value={formData.linkedin_url}
                                   onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="portfolio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Portfolio</Label>
                              <div className="relative">
                                 <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                 <Input 
                                   id="portfolio" 
                                   className="pl-10 h-10 text-xs"
                                   placeholder="yourportfolio.com"
                                   value={formData.portfolio_url}
                                   onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Full Width: Address */}
                        <div className="space-y-2 md:col-span-2 pt-2">
                           <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location / Address</Label>
                           <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Textarea 
                                id="address" 
                                className="pl-10 min-h-[80px] border-border/60 focus:ring-primary/20 bg-muted/10"
                                placeholder="City, Country"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              />
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 flex justify-end gap-3 border-t border-border/50 pt-6">
                        <Button
                           variant="ghost"
                           className="h-10 font-medium px-6"
                           onClick={() => window.location.reload()}>
                           Discard Changes
                        </Button>
                        <Button
                           onClick={handleUpdate}
                           disabled={updating}
                           className="gradient-primary text-primary-foreground h-10 px-8 shadow-lg shadow-primary/20 font-bold">
                           {updating ? (
                              <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                              </>
                           ) : (
                              "Save Changes"
                           )}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Right Column: Sidebar info */}
            <div className="space-y-8">
               <Card className="border-border/50 shadow-sm bg-card">
                  <CardHeader className="pb-4 border-b border-border/40 mb-4 bg-muted/20">
                     <CardTitle className="text-lg">Stats Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                     {stats.map((stat, i) => (
                        <div
                           key={i}
                           className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                           <div className="flex items-center gap-3">
                              <div
                                 className={cn(
                                    "p-2.5 rounded-lg bg-background shadow-sm border border-border/20",
                                    stat.color,
                                 )}>
                                 <stat.icon className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground">
                                 {stat.label}
                              </span>
                           </div>
                           <span className="text-xl font-black tabular-nums">{stat.value}</span>
                        </div>
                     ))}
                  </CardContent>
               </Card>

               <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
                  <CardHeader className="pb-2 bg-muted/20 border-b border-border/40 mb-2">
                     <CardTitle className="text-lg flex items-center justify-between">
                        Recent Activity
                        <History className="h-4 w-4 text-muted-foreground" />
                     </CardTitle>
                     <CardDescription className="text-[10px]">
                        Latest interview results
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                     {submissions?.length ? (
                        <div className="divide-y divide-border/40">
                           {submissions.slice(0, 5).map((s: any) => (
                              <div
                                 key={s.id}
                                 className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between cursor-default">
                                 <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold truncate max-w-[140px] tracking-tight">
                                       {s.question?.title || "Practice Sessions"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                       {new Date(s.createdAt || s.created_at).toLocaleDateString()}
                                    </span>
                                 </div>
                                 <Badge
                                    className={cn(
                                       "text-[10px] h-6 px-2 font-bold",
                                       s.score >= 80
                                          ? "bg-emerald-500"
                                          : s.score >= 50
                                            ? "bg-amber-500"
                                            : "bg-slate-500",
                                    )}>
                                    {s.score}%
                                 </Badge>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="py-12 text-center">
                           <Code2 className="h-10 w-10 mx-auto text-muted-foreground/20 mb-3" />
                           <p className="text-[10px] text-muted-foreground px-10 leading-relaxed">
                              No practice activity recorded yet. Start an interview to see stats
                              here.
                           </p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
